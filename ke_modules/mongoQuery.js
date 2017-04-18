let Promise = require('promise');
let dataModel = require('./metadataSchema').meta;
let resizingInfoModel = require('./metadataSchema').log;


let insertBasicData = function (data, callback) {
    dataModel.create(data, (error, result) => {
        if (error) {
            console.log(error);
            return callback(error, null);
        }
        console.log('Basic Data Inserted! -> image name:' + data.imageName);
        return callback(null, result);
    })
}

let insertLogData = function (basicDataId, logData) {
    resizingInfoModel.create(
        {
            metadataId: basicDataId,
            resizedWidth: logData.resizedWidth,
            resizedHeight: logData.resizedHeight
        }, (error, result) => {
            if (error) {
                console.log(error);
                return;
            }
        });
}

let getMetaData = function (hashedUrl, width, height) {
    return new Promise((resolve, reject) => {
        dataModel.findOne({ hashedUrl: hashedUrl }, { _id: true, imageName: true, ratio: true }, (error, metaData) => {
            if (error) {
                console.log(error);
                reject(error);
                return;
            }
            if (!metaData) {
                resolve(null);
                return;
            }


            resizingInfoModel.findOne(
                { metadataId: metaData._id, $or: [{ resizedWidth: width }, { resizedHeight: height }] }
                , (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    //if there's no history of that size, undefined will be delivered.

                    resolve({ basicInfo: metaData, resizedInfo: result });
                })
        })
    })
}

module.exports = {
    getMetaData: getMetaData,
    insertBasicData: insertBasicData,
    insertLogData: insertLogData
}

