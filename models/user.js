const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

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
	},
	// since we have an assessment model that references useres, I dont think there needs
	// to be an assessment field for the user model
	// assessments: {
	// 	type: [
	// 		{
	// 			type: Schema.Types.ObjectId,
	// 			ref: 'Assessment',
	// 			required: true
	// 		},
	// 	],
	// 	default: []
	// }
})

UserSchema.pre("save", async function(next) {
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
		console.log(password, this.password)
		const isMatch = await bcrypt.compare(password, this.password);
		return cb(null, isMatch);
	} catch (error) {
		return cb(error);
	}
};

module.exports = mongoose.model('User', UserSchema);