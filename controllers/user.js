const User = require("../models/user");
const getTokenForUser = require("../services/token");

const STATUS_USER_ERROR = 422;

const sendUserError = (err, res) => {
	res.status(STATUS_USER_ERROR);
	if (err && err.message) {
		res.json({ message: err.message, stack: err.stack });
	} else {
		res.json({ error: err });
	}
};

const createUser = async (req, res) => {
	const { email, password, username } = req.body;
	try {
		const user = await new User({
			email,
			password,
			username
		}).save();
		// send token as well
		return res.json({
			success: true,
			message: "Successfully created new user",
			token: getTokenForUser(user),
			username: username
		});
	} catch (error) {
		console.log(error)

		return res
			.status(STATUS_USER_ERROR)
			.json({ success: false, error: error.message });
	}
};

module.exports = {
	createUser
};