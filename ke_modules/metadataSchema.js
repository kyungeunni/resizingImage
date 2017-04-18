var mongoose = require('./mongoConnector');

let MetadataSchema = new mongoose.Schema({
    hashedUrl: String,
    url: String,
    imageName: String,
    origWidth: Number,
    origHeight: Number,
    ratio: Number

});

let resizingInfoLog = new mongoose.Schema({
    metadataId: mongoose.Schema.Types.ObjectId,
    resizedWidth: Number,
    resizedHeight: Number

}, { timestamps: true })

module.exports.meta = mongoose.model('metadata', MetadataSchema, 'metadata');
module.exports.log = mongoose.model('resizingInfo', resizingInfoLog, 'resizedinfo');