var express = require('express');
var http = require('http');
var path = require('path');
var images = require('./routes/images');

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', images);


app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.use(function (err, req, res, next) {

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

var server = http.createServer(app);

server.listen('3000');
server.on('error', (error) => {
    console.error(error);
})

server.on('listening', () => {
    console.log('http Server on port 3000...');
});