const assert = require('chai').assert;
const funcs = require('../controllers/youtubeAssessorControllers');

const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/auto-assess-test', { useMongoClient: true });

describe('youtubeAssessorControllers', () => {
    describe('Score', () => {
        const score = funcs.score;
        it('should be a function', () => {
            assert.typeOf(score, 'function');
        });
    })
    describe('Score', () => {
        const score = funcs.score;
        it('should be a function', () => {
            assert.typeOf(score, 'string');
        });
    })
})