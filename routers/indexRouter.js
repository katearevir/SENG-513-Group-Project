const express = require('express');
const Course = require('../models/course')
const Department = require('../models/department')

const indexRouter = express.Router();

indexRouter.get('/', async (req, res) => {
    const courses = await Course.find()
    const departments = await Department.find();
    res.render(('index.ejs'), { Courses: courses, Departments: departments});
   // res.render(('index.ejs'), { Departments: departments}); CANNOT USE 
});

module.exports = indexRouter;