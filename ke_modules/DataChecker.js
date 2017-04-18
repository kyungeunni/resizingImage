let crypto = require('crypto');
let promise = require('promise');
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

    scanDatabase() {
        return new promise((resolve, reject) => {
            mongoQuery
                .getMetaData(this.hashUrl(), this.width, this.height)
                .then((result) => {
                    //return format: {basicInfo:metaData, resizedInfo:result}
                    if (!result) {
                        console.log('[+] New url!');
                        let basicInfoOfImage = null;
                        //new image url --> download the image & store metadata to basic info collection & calculate the size  & store it to resizing info collection.
                        imageDownloader(this.url)
                            .then(basicInfo => {
                                basicInfoOfImage = basicInfo;
                                return this.storeMetaData(basicInfo);
                            })
                            .then(result => {
                                let newSize = this.calcNewSize(basicInfoOfImage.ratio);
                                console.log('new size calculated!')
                                this.storeResizedData(result._id, newSize);
                                resolve({ basicInfo: result, resizedInfo: newSize });
                            })
                            .catch(error => {
                                console.log(error);
                                reject(error);
                            });

                    } else if (!result.resizedInfo) {
                        //new size called --> 1. calculate the size & store it to resizing info collection.
                        console.log('[+] exist url & new size...');
                        result.resizedInfo = this.calcNewSize(result.basicInfo.ratio);
                        console.log('new size calculated!')
                        this.storeResizedData(result.basicInfo._id, result.resizedInfo);
                        return resolve(result);
                    } else {
                        //it has been called with same url, same size --> use the info we have
                        console.log('[+] I know everyting! -> no calculating! ')
                        return resolve(result);
                    }
                }, error => {
                    console.log(error);
                    return reject(error);
                });
        });
    }

    storeMetaData(data) {
        return new Promise((resolve, reject) => {
            mongoQuery
                .insertBasicData({
                    hashedUrl: this.urlHashed,
                    url: this.url,
                    imageName: data.imageName,
                    origWidth: data.width,
                    origHeight: data.height,
                    ratio: data.ratio
                })
                .then(result => {
                    console.log('Basic Info INSERTED in MONGO!');
                    resolve(result);
                }, error => {
                    reject(error);
                });
        });
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