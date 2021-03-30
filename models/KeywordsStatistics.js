const mongoose = require('mongoose');

const KeywordStatisticsSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.ObjectId, default: new mongoose.Types.ObjectId()},
    keyword: {type: String},
});

module.exports = mongoose.model('keywordStatistics', KeywordStatisticsSchema);
