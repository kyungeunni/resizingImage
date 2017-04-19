const Promise = require('promise');
const dataModel = require('./metadataSchema').meta;
const resizingInfoModel = require('./metadataSchema').log;


exports.insertBasicData = function(data) {
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
};

exports.insertLogData = function(basicDataId, logData, imageName, type) {
    resizingInfoModel.create({
        metadataId: basicDataId,
        resizedWidth: logData.resizedWidth,
        resizedHeight: logData.resizedHeight,
        path: imageName,
        type,
    }, error => {
        if (error) {
            console.log(error);
            return;
        }
    });
};

exports.getMetaData = function(hashedUrl, width, height) {
    return new Promise((resolve, reject) => {
        let metadata = null;
        dataModel.findOne({ hashedUrl })
            .then(metaData => {
                if (!metaData) {
                    resolve(null);
                    return;
                }
                metadata = metaData;
                return resizingInfoModel.findOne(
                    {
                        metadataId: metaData._id,
                        $or: [{ resizedWidth: width }, { resizedHeight: height }],
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
};
