const userController = require('../controllers/user');
const youtubeAssessorController = require('../controllers/youtubeAssessor');
const assessmentController = require('../controllers/assessment');
const authController = require('../controllers/auth');

const apiPrefix = "/api/v1";

module.exports = (app) => {

	app.route(`${apiPrefix}/register`)
		.post(userController.createUser);

	app
		.route(`${apiPrefix}/signin`)
		.post(authController.requireSignIn, authController.signIn);

	app.route(`${apiPrefix}/user/assessments`)
		.get(authController.requireSignIn, assessmentController.getUserAssessments);

	app.route(`${apiPrefix}/assess`)
		.post(authController.requireAuth, youtubeAssessorController.assessVid);

	app.route(`${apiPrefix}/test`)
		.get((req, res) => res.send("yoooo"));
};
