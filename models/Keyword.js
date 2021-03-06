const mongoose = require('mongoose');

const KeywordSchema = new mongoose.Schema({
  _id: {type: mongoose.Schema.ObjectId, default: new mongoose.Types.ObjectId()},
  name: {type: String},
  scraped: {type: Number}
});

module.exports = mongoose.model('keyword', KeywordSchema);
