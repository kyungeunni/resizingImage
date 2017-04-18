let crypto = require('crypto');
let mongoQuery = require('./mongoQuery');
let imageDownloader = require('./imageDownloader');



class DataChecker {
    constructor(url, width, height) {
        this.url = url;
        this.width = width || null;
        this.height = height || null;
    }

    hashUrl() {
        let urlHasher = crypto.createHash('sha1');
        urlHasher.update(this.url);
        this.urlHashed = urlHasher.digest('base64');
        return this.urlHashed;
    }

    scanDatabase(callback) {
        mongoQuery
            .getMetaData(this.hashUrl(), this.width, this.height)
            .then((result) => {
                //return format: {basicInfo:metaData, resizedInfo:result}
                if (!result) {
                    //new image url --> download the image & store metadata to basic info collection & calculate the size  & store it to resizing info collection.
                    imageDownloader(this.url)
                        .then(basicInfo => {
                            console.log('[+] New url!');
                            this.storeMetaData(basicInfo, (error, result) => {
                                let newSize = this.calcNewSize(basicInfo.ratio);
                                console.log('new size calculated!')
                                this.storeResizedData(result._id, newSize);
                                return callback(null, { basicInfo: result, resizedInfo: newSize });
                            })
                        })
                } else if (!result.resizedInfo) {
                    //new size called --> 1. calculate the size & store it to resizing info collection.
                    console.log('[+] exist url & new size...');
                    result.resizedInfo = this.calcNewSize(result.basicInfo.ratio);
                    console.log('new size calculated!')
                    this.storeResizedData(result.basicInfo._id, result.resizedInfo);
                    return callback(null, result);
                } else {
                    //it has been called with same url, same size --> use the info we have
                    console.log('[+] I know everyting! -> no calculating! ')
                    return callback(null, result);
                }
            }, error => {
                console.log(error);
                return callback(error, null);
            })
    }

    storeMetaData(data, callback) {
        mongoQuery.insertBasicData(
            {
                hashedUrl: this.urlHashed,
                url: this.url,
                imageName: data.imageName,
                origWidth: data.width,
                origHeight: data.height,
                ratio: data.ratio
            }
            , (error, result) => {
                if (error) {
                    console.log(error);
                    return callback(error, null);
                }
                console.log('Basic Info INSERTED in MONGO!');
                return callback(null, result);
            })
    }

    storeResizedData(metaId, data) {
        mongoQuery.insertLogData(metaId, data);
    }

    calcNewSize(ratio) {
        if (this.width && this.height) {
            return {
                resizedWidth: this.width,
                resizedHeight: this.height
            }
        }
        if (this.width) {
            return {
                resizedWidth: this.width,
                resizedHeight: this.width * ratio
            }
        }

        if (this.height) {
            return {
                resizedWidth: this.height / ratio,
                resizedHeight: this.height
            }
        }

        return null;
    }
}

module.exports = DataChecker;