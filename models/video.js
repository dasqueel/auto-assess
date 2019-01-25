const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*

what do we want to store about a video?
do we make a copy of youtubes videos meta data so we can call it quicker and not hit their api
which would cost $$$

* text

*/

const VideoSchema = new Schema({
	youtubeId: {
		type: String,
		required: true,
		unique: true
	},
})

module.exports = mongoose.model('Question', VideoSchema);