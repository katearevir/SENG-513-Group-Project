const express = require('express');
const Feedback = require('../models/feedback');

const courseCommentsRouter = express.Router();

courseCommentsRouter.get('/', async (req, res) => {
    const reviews = await Feedback.find();
    res.render(('courseComments.ejs'), { Reviews: reviews });
});

module.exports = courseCommentsRouter;