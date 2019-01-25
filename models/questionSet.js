const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSetSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    categories: {
        type: Array,
        default: [],
        required: true
    },
    questions: {
        type: Array,
        default: [{
            type: Schema.Types.ObjectId,
            ref: 'Question'
        }],
        required: true,
        default: true
    }
})

module.exports = mongoose.model('QuestionSet', QuestionSetSchema);