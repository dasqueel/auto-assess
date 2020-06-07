const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*

a user answers questions with answers (various resources)

user has a reference to a question

    meta data of the resource 

*/

const Answer = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    url: {
        type: String,
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
    // meta info on the resource. ex if its youtube or text or drawings
})

module.exports = mongoose.model('Answer', Answer);