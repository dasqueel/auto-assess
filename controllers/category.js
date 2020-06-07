const Category = require("../models/category")

const createCategory = async (req, res) => {
    const { name } = req.body

    try {
        const category = await new Category({
            name
        }).save()

        return res.json(category);
    } catch (error) {
        return res
            .json({ success: false, error: error.message })
    }
};

const getCategories = async (req, res) => {
    // possible filters
    // const { name } = req.body

    Category
        .find()
        .select('-__v')
        .then(categories => {
            res.json(categories)
        })
        .catch(err => res.json(err));
};

module.exports = {
    createCategory,
    getCategories
}