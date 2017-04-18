let Promise = require('promise');
let path = require('path');
let DataChecker = require('../ke_modules/DataChecker');
const imagePath = path.join(__dirname.substring(0, __dirname.lastIndexOf('/')), '/public/images/');

exports.resize = function (query) {
    return new Promise((resolve, reject) => {
        let getImage = new DataChecker(query.url, query.width, query.height);
        getImage.scanDatabase()
            .then((result) => {
                console.log(`INFO:
                width:${result.resizedInfo.resizedWidth},
                height:${result.resizedInfo.resizedHeight}, 
                imagepath:/images/${result.basicInfo.imageName}`);
                let resultSet = {
                    status: 200,
                    imagePath: imagePath + result.basicInfo.imageName
                };
                resolve(resultSet);
            }, error => {
                reject(error);
            });
    });
}
