const mongoose = require('mongoose');

require("../models/assessment");
require("../models/acceptedAssessment");
require("../models/metaInfoAssessment");
const AcceptedAssessment = mongoose.model('AcceptedAssessment');
const MetaInfoAssessment = mongoose.model('MetaInfoAssessment');
const Assessment = mongoose.model('Assessment');

const parser = require('subtitles-parser');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
// const tokenizer = new natural.TreebankWordTokenizer(); // another way to nlp words
const fs = require('fs');
const stopwords = require('stopwords').english;
const shell = require('shelljs');
const successMsg = { success: true };

/*
overall goals
// translate video
// score compare to rubic
// return score
*/

// score takes in a question <str> and list of words the user used <array>
// returns a score metric object with attributes of percentageSaidAll, validWordsSaid, importantWordsSaid, percentageSaidImportant, and generalScore
const score = async (question, userWords) => {
	// the object we will return at the end
	const scoreMetrics = {};
	// a unique set of the words the user used
	let userWordSet = new Set(userWords)

/*
	get the valid words used in an array
	calculate the percentage of non stop words said

	get all acceptedAssessments for that question and compute the score metrics
*/

try {
	const acceptedAssessments = await AcceptedAssessment.find({ question });

	// get all the words from all accepted assessments
	const acceptedWords = new Set(acceptedAssessments.reduce((words, acceptedAssessment) => {
		words = words.concat(acceptedAssessment.wordCount.map(wordObj => wordObj.word))
		return words
	}, []))

	// get the joint words that the user used in assessment and the acceptedWords
	let commonWords = [...acceptedWords].filter(i => userWordSet.has(i));
	// calculate the percentage of words the user used compared to all acceptedwords
	let percentageSaid = Math.round(100 * (commonWords.length / [...acceptedWords].length)) / 100;

	// add metrics to the score metrics object
	scoreMetrics.percentageSaidAll = percentageSaid;
	scoreMetrics.validWordsSaid = commonWords;

}	catch(error) {
	// respond with acceptedAssessments mongo read error
	// return { success: false, error };
	console.log(error);
}

/*
	goal is to add the important words a user should say
	and add those values to the scoreMetric object
	import words are stored in a metaInfoAssessment document in mongodb
*/

try {
	const metaInfoAssessment = await MetaInfoAssessment.findOne({ question });

	// get the docs important words
	const importantWords = metaInfoAssessment['importantWords'];
	// do calculations of important words used and percentage
	let importantWordsSaid = importantWords.filter(i => userWordSet.has(i))

	let percentageSaidImportant = Math.round(100 * (importantWordsSaid.length / importantWords.length)) / 100;

	// add metrics to the score metrics object
	scoreMetrics.importantWordsSaid = importantWordsSaid;
	scoreMetrics.percentageSaidImportant = percentageSaidImportant;

} catch(error) {
	// respond with metaInfoAssessment mongo read error
	// return { success: false, error };
	console.log(error);
}
	return scoreMetrics;
}

/*
	takes in youtube video id and the question its assessing for
	transcribes the video and scores it

*/
const assessVid = (req, res) => {
	const { vidId, question } = req.body;

	// get the owner from the jwt
	const owner = req.user._id;

	Assessment.findOne({ 'vidId' : vidId })
		.then(doc => {
			// check if the video has already been assessed
			if (doc) return res.send('video already entered!');
			// if video has not been assessed, assess it
			else {
				const fileName = vidId;

				// download youtube videos transcription
				tubeCmd = `youtube-dl --write-auto-sub --sub-lang en --skip-download -o ./vtts/${fileName}.vtt http://www.youtube.com/watch?v=${vidId} >/dev/null`;
				shell.exec(tubeCmd);

				// convert vtt transcription to an srt transcription
				vttToSrtCmd = `ffmpeg -i ./vtts/${fileName}.en.vtt ./srts/${fileName}.en.srt >/dev/null`
				shell.exec(vttToSrtCmd);

				// read an srt file
				const srt = fs.readFileSync(`./srts/${fileName}.en.srt`,'utf8');

				// remove srts and vtts
				shell.exec(`rm ./vtts/${fileName}.en.vtt`);
				shell.exec(`rm ./srts/${fileName}.en.srt`);

				// get data from srt file
				const data = parser.fromSrt(srt);

				// aggregate all text into one string
				rawTranscription = data.reduce((accumerlator, obj) => {
					return `${accumerlator} ${obj.text}`;
				}, '')

				// break string into array of tokens
				let tokens = tokenizer.tokenize(rawTranscription);

				// filter out stop words and words with digits in them
				// and change the word to lower case
				const nonStopWords = tokens.filter(word => !stopwords.includes(word) && !/\d/.test(word))
															.map(word => word.toLowerCase());

				// calculate word count
				const wordCountObj = nonStopWords.reduce((tally, word) => {
					tally[word] = (tally[word] || 0) + 1;
					return tally;
				} , {})

				let wordCount = [];
				for (let [key, value] of Object.entries(wordCountObj)) {
					wordCount.push({word: key, count: value})
				}

				// score the vid
				score(question, nonStopWords)
					.then(scoreMetrics => {
						const newAssessment = new Assessment({
							owner,
							question,
							percentageSaidAll: scoreMetrics.percentageSaidAll,
							percentageSaidImportant: scoreMetrics.percentageSaidImportant,
							importantWordsSaid: scoreMetrics.importantWordsSaid,
							validWordsSaid: scoreMetrics.validWordsSaid,
							vidId,
							rawTranscription,
							nonStopWords,
							wordCount
						})
						newAssessment.save()
							// .then(doc => res.json(doc))
							.then(doc => {
								res.header("Content-Type", 'application/json');
								res.send(JSON.stringify(doc, null, 4));
							})
							.catch(err => res.status(422).json(err))
					})
					.catch(err => {
						console.log(err);
						// respond with scoring function error
					})
			}
		})
		.catch(err => res.json(err))

}

module.exports = {
	assessVid,
	score
};