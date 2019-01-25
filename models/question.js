const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    text: {
        type: String,
        required: true,
        unique: true
    },
    categories: {
        type: Array,
        default: [],
        required: true
    },
    playlists: {
        type: Array,
        default: [],
        required: true
    }
})

module.exports = mongoose.model('Question', QuestionSchema);