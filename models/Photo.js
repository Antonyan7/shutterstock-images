const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  _id: {type: mongoose.Schema.ObjectId, default: new mongoose.Types.ObjectId()},
  name: {type: String},
  aspect: {type: Number},
  thumb: {
    height: {type: Number},
    url: {type: String},
    width: {type: Number}
  },
  keywords: {type: Array},
  description: {type: String},
  image_type: {type: String}
});

module.exports = mongoose.model('photo', PhotoSchema);
