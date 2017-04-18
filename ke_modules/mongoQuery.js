let Promise = require('promise');
let dataModel = require('./metadataSchema').meta;
let resizingInfoModel = require('./metadataSchema').log;


let insertBasicData = function (data, callback) {
    return new Promise((resolve, reject) => {
        dataModel.create(data, (error, result) => {
            if (error) {
                console.log(error);
                return reject(error);
            }
            console.log('Basic Data Inserted! -> image name:' + data.imageName);
            resolve(result);
        });
    });
}

let insertLogData = function (basicDataId, logData, imageName, type) {
    resizingInfoModel.create(
        {
            metadataId: basicDataId,
            resizedWidth: logData.resizedWidth,
            resizedHeight: logData.resizedHeight,
            path:imageName,
            type: type
        }, (error, result) => {
            if (error) {
                console.log(error);
                return;
            }
        });
}

let getMetaData = function (hashedUrl, width, height) {
    return new Promise((resolve, reject) => {
        let metadata = null;
        dataModel.findOne({ hashedUrl: hashedUrl })
            .then(metaData => {
                if (!metaData) {
                    resolve(null);
                    return;
                }
                metadata = metaData;
                return resizingInfoModel.findOne(
                    {
                        metadataId: metaData._id,
                        $or: [{ resizedWidth: width }, { resizedHeight: height }]
                    });
            })
            .then(result => {
                //if there's no history of that size, undefined will be delivered.
                resolve({ basicInfo: metadata, resizedInfo: result });
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = {
    getMetaData: getMetaData,
    insertBasicData: insertBasicData,
    insertLogData: insertLogData
}

