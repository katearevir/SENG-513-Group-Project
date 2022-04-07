const express = require('express');
const Course = require('../models/course')
const Department = require('../models/department')

const indexRouter = express.Router();

indexRouter.get('/', async (req, res) => {
    const courses = await Course.find().sort({ "course": 1 })
    const departments = await Department.find().sort({ "department": 1 });
    if (res.locals.user) {
        if (res.locals.user.isAdmin) {
            return res.render(('index.ejs'), { Courses: courses, Departments: departments, isAdmin: true });
        };
    }
    res.render(('index.ejs'), { Courses: courses, Departments: departments, isAdmin: false });
});

module.exports = indexRouter;