const STATUS_USER_ERROR = 422;

const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

const validateCreateUserParams = (req, res, next) => {
	const { username, password } = req.body;

	if (!username && !password) sendUserError('please provide a username and password', res);

	req.username = username;
	req.password = password;
	next();
}

module.exports = {
  sendUserError,
  validateCreateUserParams,
  validateLoggedIn
}