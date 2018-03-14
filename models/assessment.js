const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssessmentSchema = new Schema({
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	question: {
		type: String,
		required: true
	},
	percentageSaidImportant: {
		type: Number,
		default: 0
	},
	percentageSaidAll: {
		type: Number,
		default: 0
	},
	score: {
		type: Number,
		default: 0
	},
	validWordsSaid: {
		type: Array,
		default: []
	},
	importantWordsSaid: {
		type: Array,
		default: []
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
		type: Array,
		default: []
	},
	date: {
		type: Date,
		default: Date.now
	},
	// do we need this field if we have an acceptedAssessment model?
	accepted: {
		type: Boolean,
		required: true,
		default: false
	}
})

module.exports = mongoose.model('Assessment', AssessmentSchema);