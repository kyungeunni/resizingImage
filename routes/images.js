const express = require('express');
const router = express.Router();
const controller = require('../controller/imageCO');

router.get('/resize', (request, response, next) => {
    controller
        .resize(request.query)
        .then(result => {
            response.status(result.status);
            response.setHeader('Content-Type', 'image/' + result.type || 'jpeg');
            response.sendFile(result.imagePath);

        }, error => {
            console.log(error);
            next(error);
        });
});

module.exports = router;
