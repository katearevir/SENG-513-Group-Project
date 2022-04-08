const express = require('express');
const CourseModel = require('../models/course')
const DepartmentModel = require('../models/department')
const FeedbackModel = require('../models/feedback')

const indexRouter = express.Router();

indexRouter.get('/', async (req, res) => {
    const courses = await CourseModel.aggregate([
        {
            "$lookup": {
                "from": "feedbacks",
                "localField": "messages",
                "foreignField": "_id",
                "as": "messages"
            }
        },
        {
            "$addFields": {
                "avgRating": { "$avg": "$messages.rating" }
            }
        }
    ]).sort({ "avgRating": -1 });

    const departments = await DepartmentModel.find().sort({ "department": 1 });
    if (res.locals.user) {
        if (res.locals.user.isAdmin) {
            return res.render(('index.ejs'), { Courses: courses, Departments: departments, isAdmin: true });
        };
    }
    res.render(('index.ejs'), { Courses: courses, Departments: departments, isAdmin: false });
});

module.exports = indexRouter;