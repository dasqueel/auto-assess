const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// do we have an Order Attribute that dictaces what order to answer them in?  it would be an int?

const QuestionSetSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    categories: {
        type: Array,
        default: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Category'
            }
        ],
        required: true
    },
    questions: {
        type: Array,
        default: [{
            type: Schema.Types.ObjectId,
            ref: 'Question'
        }],
        required: true
    }
})

module.exports = mongoose.model('QuestionSet', QuestionSetSchema);