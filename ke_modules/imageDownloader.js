const path = require('path');
const Promise = require('promise');
const download = require('image-downloader');
const sizeOf = require('image-size');
const dest = path.join(__dirname.substring(0, __dirname.lastIndexOf('/')), '/public/images');

function getDimensions(filename) {
    return new Promise((resolve, reject) => {
        sizeOf(`${filename}`, (error, dimensions) => {
            if (error) {
                console.log(error);
                reject(error);
                return;
            }

            console.log('image Size: ' + dimensions.width, dimensions.height);

            dimensions.imageName = filename.substr(filename.lastIndexOf('/') + 1);
            dimensions.type = filename.substr(filename.lastIndexOf('.') + 1);
            resolve(dimensions);
        });
    });
}

function getRatio(dimensions) {
    return dimensions.height / dimensions.width;
}

function imageDownloader(url) {
    return new Promise((resolve, reject) => {
        download.image({ url, dest })
            .then(({ filename }) => {
                console.log(`new image downloded => ${filename}`);
                return getDimensions(filename);

            })
            .then(result => {
                result.ratio = getRatio(result);
                resolve(result);
            })
            .catch(error => {
                console.error(error);
                reject(error);
            });
    });
}
module.exports = imageDownloader;
