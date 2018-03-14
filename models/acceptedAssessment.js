const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AcceptedAssessmentSchema = new Schema({
	question: {
		type: String,
		required: true
	},
	score: {
		type: Number,
		default: 0,
		required: true
	},
	vidId: {
		type: String,
		required: true,
		unique: true
	},
	rawTranscription: {
		type: String
	},
	nonStopWords: {
		type: Array
	},
	wordCount: {
		type: Array
	},
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('AcceptedAssessment', AcceptedAssessmentSchema);