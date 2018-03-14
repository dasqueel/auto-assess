const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MetaInfoAssessment = new Schema({
    question: {
        type: String,
        required: true
    },
    importantWords: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model('MetaInfoAssessment', MetaInfoAssessment);