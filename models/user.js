const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

// do we add Questions and Answers array?
/*

if we a Questions and Answers list

what do you gain from having a Questions and Answers list 

what about indexing?

* typically a user probably wont have more than a 1000 answers

Pros
	* easier access of getting for GET and UPDATE calls

vs

having a relational reference 

Pros
	* no redunant persisted fields
	* if wanting to do analyse of Questions or Answers, you dont have to iterate
		over user and get all answers
*/

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true
	}
	// answers: {
	// 	type: [Answer],
	// 	required: true,
	// 	default: []
	// }
})

UserSchema.pre("save", async function (next) {
	try {
		const hash = await bcrypt.hash(this.password, 11);
		this.password = hash;
		return next();
	} catch (error) {
		return next(error);
	}
});

UserSchema.methods.checkPassword = async function (password, cb) {
	try {
		const isMatch = await bcrypt.compare(password, this.password);
		return cb(null, isMatch);
	} catch (error) {
		return cb(error);
	}
};

module.exports = mongoose.model('User', UserSchema);