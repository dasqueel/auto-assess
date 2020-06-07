const QuestionSet = require("../models/questionSet")

const createQuestionSet = async (req, res) => {
    const { title, categories, questions } = req.body
    try {
        const questionSet = await new QuestionSet({
            title,
            categories,
            questions
        }).save()

        return res.json(questionSet);
    } catch (error) {
        return res
            .json({ success: false, error: error.message })
    }
};

const getQuestionSet = async (req, res) => {
    // return questionSet obj from title or id
    // maybe all questionSets for a certain category?
    const { title, id } = req.body

    QuestionSet
        .find() // do an OR find title == or id ==
        .select('title _id')
        .then(QuestionSets => {
            res.json(QuestionSets)
        })
        .catch(err => res.json(err));
};

const getQuestionSets = async (req, res) => {
    QuestionSet
        .find()
        .populate({
            path: 'categories',
            model: 'Category',
            select: 'name'
        })
        .populate({
            path: 'questions',
            model: 'Question',
            select: 'text'
        })
        .select('-__v')
        .then(QuestionSets => {
            res.json(QuestionSets)
        })
        .catch(err => res.json(err));
};

module.exports = {
    createQuestionSet,
    getQuestionSets,
    getQuestionSet
}