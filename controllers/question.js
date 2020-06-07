const Question = require("../models/question")
const QuestionSet = require("../models/questionSet")
const ObjectId = require('mongoose').Types.ObjectId;

const createQuestion = async (req, res) => {

	// TODO: when creating a question with a questionSet
	// make sure to add the created questionId to the questionSets.questions

	const { text, categories, questionSets } = req.body

	try {
		const question = await new Question({
			text,
			categories,
			questionSets
		}).save()

		console.log({ question })

		// if questtionSets was passed
		// add questionId to questionSet
		// make this a function its self, abstrac the logic
		if (questionSets.length > 0) {
			questionSets.forEach(questionSetId => {
				QuestionSet.findByIdAndUpdate(questionSetId, { $addToSet: { questions: question._id } })
					// QuestionSet.update({ _id: questionSetId }, { $addToSet: { questions: question._id } })
					.then(newQuestionObj => {
						console.log(`added new ${newQuestionObj} to questionSets.questions`)
					})
					.catch(err => console.log(`could not add new question, should add it to a retry queue`))
			})
		}

		return res.json(question);
	} catch (error) {
		console.log(error)
		return res
			.json({ success: false, error: error.message })
	}
};

const deleteQuestion = async (req, res) => {
	// take questionId
	const questionId = req.query.id
	const questionDoc = await Question.findById(questionId)

	// loop through questionSets to remove references
	const questionQuestionSets = questionDoc.questionSets

	questionQuestionSets.forEach(questionSet => {
		QuestionSet.updateOne({ _id: ObjectId(questionSet) }, { $pull: { questions: ObjectId(questionId) } })
			.then(updatedDoc => console.log({ updatedDoc }))
			.catch(err => console.log({ err }))
	})

	// remove the doc
	Question.deleteOne({ _id: questionId })
		.then(x => res.json(x))
		.catch(err => res.json(err))
};

const getQuestions = async (req, res) => {
	const { categories, questionSets } = req.body

	Question
		.find()
		.select('text _id')
		.populate({
			path: 'categories',
			model: 'Category',
			select: 'name'
		})
		.populate({
			path: 'questionSets',
			model: 'QuestionSet',
			select: 'title'
		})
		.then(questions => {
			res.json(questions)
		})
		.catch(err => res.json(err));
};

module.exports = {
	createQuestion,
	deleteQuestion,
	getQuestions
}