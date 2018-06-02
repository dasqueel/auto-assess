const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;  // for find querying by ObjectId
require("../models/assessment");
const Assessment = mongoose.model('Assessment');

const STATUS_USER_ERROR = 422;

const sendUserError = (err, res) => {
    res.status(STATUS_USER_ERROR);
    if (err && err.message) {
        res.json({ message: err.message, stack: err.stack });
    } else {
        res.json({ error: err });
    }
};

const getUserAssessments = (req, res) => {
  const user = req.user;
	Assessment.find({ owner: new ObjectId(user._id) })
		.then((assessments) => {
			res.json(assessments);
		})
		.catch((err) => {
			res.status(500).json(err);
		})
}

module.exports = {
  getUserAssessments
};