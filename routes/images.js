var express = require('express');
var router = express.Router();

var DataChecker = require('../ke_modules/DataChecker');



router.get('/resize', (request, response, next) => {
    let getImage = new DataChecker(request.query.url, request.query.width, request.query.height);
    getImage.scanDatabase((error, result) => {
        console.log(`width:${result.resizedInfo.resizedWidth},
            height:${result.resizedInfo.resizedHeight}, 
            imagepath:/images/${result.basicInfo.imageName}`);
        response.status(200);
        response.render('image',
            {
                width: result.resizedInfo.resizedWidth,
                height: result.resizedInfo.resizedHeight,
                imagepath: '/images/' + result.basicInfo.imageName
            });
    });

})

module.exports = router;