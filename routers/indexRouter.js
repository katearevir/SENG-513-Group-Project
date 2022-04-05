const express = require('express');
const Course = require('../models/course')

const indexRouter = express.Router();

indexRouter.get('/', async (req, res) => {
    const courses = await Course.find()
    res.render(('index.ejs'), { Courses: courses });
});

module.exports = indexRouter;