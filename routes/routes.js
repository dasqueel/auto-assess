const userController = require('../controllers/user');
const youtubeAssessorController = require('../controllers/youtubeAssessor');
const assessmentController = require('../controllers/assessment');
const authController = require('../controllers/auth');
const questionController = require('../controllers/question');
const questionSetController = require('../controllers/questionSet');
const answerController = require('../controllers/answer');
const categoryController = require('../controllers/category');

const apiPrefix = "/api/v1";

module.exports = (app) => {

	app.route(`${apiPrefix}/register`)
		.post(userController.createUser);

	app.route(`${apiPrefix}/signin`)
		.post(authController.requireSignIn, authController.signIn);

	app.route(`${apiPrefix}/user/assessments`)
		.get(authController.requireAuth, assessmentController.getUserAssessments);

	app.route(`${apiPrefix}/assess`)
		.post(authController.requireAuth, youtubeAssessorController.assessVid);

	app.route(`${apiPrefix}/test`)
		.get((req, res) => res.send("yoooo"))

	app.route(`${apiPrefix}/question`)
		.post(questionController.createQuestion)

	app.route(`${apiPrefix}/question`)
		.delete(questionController.deleteQuestion)

	app.route(`${apiPrefix}/questions`)
		.get(questionController.getQuestions)

	app.route(`${apiPrefix}/questionSet`)
		.post(questionSetController.createQuestionSet)

	app.route(`${apiPrefix}/questionSet`)
		.get(questionSetController.getQuestionSet)

	app.route(`${apiPrefix}/questionSets`)
		.get(questionSetController.getQuestionSets)

	app.route(`${apiPrefix}/category`)
		.post(categoryController.createCategory)

	app.route(`${apiPrefix}/categories`)
		.get(categoryController.getCategories)

	app.route(`${apiPrefix}/answer`)
		.post(authController.requireAuth, answerController.createAnswer)

	app.route(`${apiPrefix}/answer/:answerId`)
		.delete(authController.requireAuth, answerController.deleteAnswer)

	app.route(`${apiPrefix}/answers/:username`)
		.get(answerController.getUserAnswers)
}
