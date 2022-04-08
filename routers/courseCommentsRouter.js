const express = require('express');
const courseModel = require('../models/course');
const FeedbackModel = require('../models/feedback');

const courseCommentsRouter = express.Router();

courseCommentsRouter.get('/courseComments/:coursename', async (req, res) => {
    const course = await courseModel.findOne({ course: req.params.coursename}).lean();
    const reviews = await FeedbackModel.find({ course: course._id });
    res.render(('courseComments.ejs'), { Reviews: reviews });
});

module.exports = courseCommentsRouter;