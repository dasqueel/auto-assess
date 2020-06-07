const Answer = require("../models/answer")
const User = require("../models/user")
const ObjectId = require('mongoose').Types.ObjectId;


/*

create the new question form
sort by last updated

[
{
    questionId : {
        id
        text
    },
    answers: [
        {
            id,
            owner,
            url,
            dateAdded
        }
    ]
},
]

*/


const questionForm = (answers) => {

    const finalArray = []
    let questionSet = new Set()

    answers.forEach(answer => {

        const questionId = answer.questionId._id

        if (questionSet.has(questionId)) {

            finalArray.forEach(obj => {
                if (obj.question._id === questionId) {
                    // obj.answers.push(answer)
                    const newAnswer = {
                        _id: answer._id,
                        url: answer.url,
                        dateAdded: answer.dateAdded
                    }

                    obj.answers.push(newAnswer)
                }
            })
        }
        else {

            questionSet.add(questionId)

            const newObj = {
                question: {
                    _id: questionId,
                    text: answer.questionId.text
                },
                answers: [
                    {
                        _id: answer._id,
                        url: answer.url,
                        dateAdded: answer.dateAdded
                    }
                ]
            }

            finalArray.push(newObj)
        }
    })

    // sort answers for one question
    finalArray.forEach(obj => {
        if (obj.answers.length > 1) {
            obj.answers.sort((a, b) => {
                var c = new Date(a.dateAdded).getTime()
                var d = new Date(b.dateAdded).getTime()
                return d - c
            })
        }
    })

    // sort by latest answer for each question
    finalArray.sort((a, b) => {
        var c = new Date(a.answers[0].dateAdded).getTime()
        var d = new Date(b.answers[0].dateAdded).getTime()
        return d - c;
    })

    return finalArray
}

// do we group them by question
const getUserAnswers = async (req, res) => {
    const username = req.params.username

    // is there a better way to translate user object id to username?  do we need owner to be an object id?
    const userObj = await User.findOne({ username: username })

    // also have to group by questionId
    // so have a function that can return the QuestionId form

    if (userObj) {
        Answer
            .find({ owner: new ObjectId(userObj._id) })
            .populate('questionId', 'text')
            // .populate('owner')
            // .select('text _id')
            .then(answers => {
                const formed = questionForm(answers)
                res.json(formed)
            })
            .catch(err => res.json(err));
    } else {
        return res
            .status(401)
            .send("username not created")
    }


};

const createAnswer = async (req, res) => {

    const owner = req.user._id.toString();
    const { questionId, url } = req.query

    try {

        try {
            const query = { url: url, owner: ObjectId(owner), questionId: ObjectId(questionId) }
            const alreadyAnswer = await Answer.findOne(query)

            if (alreadyAnswer) {
                return res
                    .status(201)
                    .json({ message: "Already added video!" })
            }
        } catch (err) {
            console.log(`error trying to find Answer: message - ${error}`)
        }

        // do an api call to youtube to get the actually upload date?
        // and pass that return value to Answer construction?
        const answer = await new Answer({
            owner,
            questionId,
            url
        }).save()

        return res.json(answer);

    } catch (error) {
        console.log(error)
        return res
            .status(401)
            .json({ success: false, error: error.message })
    }
};

const deleteAnswer = async (req, res) => {

    const answerId = req.params.answerId
    const owner = req.user._id.toString()

    Answer.deleteOne({ _id: ObjectId(answerId), owner: ObjectId(owner) })
        .then(answer => res.json(answer))
        .catch(err => res.json(err))
}

module.exports = {
    createAnswer,
    getUserAnswers,
    deleteAnswer
}