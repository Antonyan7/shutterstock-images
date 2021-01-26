const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  _id: {type: mongoose.Schema.ObjectId, default: new mongoose.Types.ObjectId()},
  name: {type: String},
});

module.exports = mongoose.model('category', CategorySchema);
