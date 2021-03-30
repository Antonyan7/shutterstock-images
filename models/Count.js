const mongoose = require('mongoose');

const CountSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.ObjectId, default: new mongoose.Types.ObjectId()},
    keyword_step: {type: String},
    page: {type: String},
});

module.exports = mongoose.model('count', CountSchema);
