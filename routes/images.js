let express = require('express');
let router = express.Router();
let controller = require('../controller/imageCO');

router.get('/resize', (request, response, next) => {
    controller
        .resize(request.query)
        .then(result => {
            response.status(result.status);
            response.setHeader('Content-Type','image/jpg');
            response.sendFile(result.imagePath);

        },error=>{
            console.log(error);
            next(error);
        });
})

module.exports = router;