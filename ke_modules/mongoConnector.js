const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:17017');

const mongodb = mongoose.connection;
mongodb.on('error', error => { throw error; });

mongodb.once('connect', () => {
    console.log('mongodb conneted...');
});

module.exports = mongoose;
