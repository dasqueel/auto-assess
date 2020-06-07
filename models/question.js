const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// do we hold questionSet attribute?
// when having references, whats the point to reference each other?
// e.x. a question model has a questionSets field full of questionSet objs
//    and questionSet obj has a field with an array of question Objs
const QuestionSchema = new Schema({
    text: {
        type: String,
        required: true,
        unique: true
    },
    categories: {
        type: Array,
        default: [{
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }],
        required: true
    },
    // does the question obj need to live in the array
    // or can the Text of the question enough?
    // what does storing the ref OBJ get you?
    // even tho it doesnt make much sense now, we will store the reference to the questionSet Obj
    questionSets: {
        type: Array,
        default: [{
            type: Schema.Types.ObjectId,
            ref: 'QuestionSet'
        }],
        required: true
    }
})

module.exports = mongoose.model('Question', QuestionSchema);