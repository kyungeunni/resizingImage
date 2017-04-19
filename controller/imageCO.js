const Promise = require('promise');
const DataChecker = require('../ke_modules/DataChecker');


exports.resize = function(query) {
    return new Promise((resolve, reject) => {
        const getImage = new DataChecker(query.url, query.width, query.height);
        getImage
            .scanDatabase()
            .then(result => {
                console.log(result);
                resolve({
                    status: 200,
                    type: result.type,
                    imagePath: result.path });
            }, error => {
                reject(error);
            });
    });
};
