const express = require('express');
const CourseModel = require('../models/course')
const DepartmentModel = require('../models/department')
const FeedbackModel = require('../models/feedback')

const indexRouter = express.Router();

indexRouter.get('/', async (req, res) => {
    const urlParams = new URLSearchParams((req.url).substring(1));
    filter_lvl = urlParams.get('lvl');
    filter_department = urlParams.get('department');
    sort = urlParams.get('sort');

    var courses;
    if (filter_lvl && filter_department && sort) { // all three selected ---------------------------------------------------------------------------------------------
        const department = await DepartmentModel.findOne({ department: filter_department });
        if (sort === "High-rating") {
            courses = await CourseModel.aggregate([
                { "$match": { "level": Number(filter_lvl), "department": department._id } },
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
                        "avgRating": { "$avg": "$messages.rating" },
                        "numberOfMessages": { "$cond": { "if": { "$isArray": "$messages" }, "then": { "$size": "$messages" }, "else": "NA"} }
                    }
                }
            ]).sort({ "avgRating": -1 });
        } else if (sort === "Low-rating") {
            courses = await CourseModel.aggregate([
                { "$match": { "level": Number(filter_lvl), "department": department._id } },
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
                        "avgRating": { "$avg": "$messages.rating" },
                        "numberOfMessages": { "$cond": { "if": { "$isArray": "$messages" }, "then": { "$size": "$messages" }, "else": "NA"} }
                    }
                }
            ]).sort({ "avgRating": 1 });
        } else if (sort === "Most") {
            courses = await CourseModel.aggregate([
                { "$match": { "level": Number(filter_lvl), "department": department._id } },
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
                        "avgRating": { "$avg": "$messages.rating" },
                        "numberOfMessages": { "$cond": { "if": { "$isArray": "$messages" }, "then": { "$size": "$messages" }, "else": "NA"} }
                    }
                }
            ]).sort({ "numberOfMessages": -1 });
        } else if (sort === "Least") {
            courses = await CourseModel.aggregate([
                { "$match": { "level": Number(filter_lvl), "department": department._id } },
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
                        "avgRating": { "$avg": "$messages.rating" },
                        "numberOfMessages": { "$cond": { "if": { "$isArray": "$messages" }, "then": { "$size": "$messages" }, "else": "NA"} }
                    }
                }
            ]).sort({ "numberOfMessages": 1 });
        }
    } else if (filter_department && sort) { // If department and sort is selected ---------------------------------------------------------------------------------------------
        const department = await DepartmentModel.findOne({ department: filter_department });
        if (sort === "High-rating") {
            courses = await CourseModel.aggregate([
                { "$match": { "department": department._id } },
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
                        "avgRating": { "$avg": "$messages.rating" },
                        "numberOfMessages": { "$cond": { "if": { "$isArray": "$messages" }, "then": { "$size": "$messages" }, "else": "NA"} }
                    }
                }
            ]).sort({ "avgRating": -1 });
        } else if (sort === "Low-rating") {
            courses = await CourseModel.aggregate([
                { "$match": { "department": department._id } },
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
                        "avgRating": { "$avg": "$messages.rating" },
                        "numberOfMessages": { "$cond": { "if": { "$isArray": "$messages" }, "then": { "$size": "$messages" }, "else": "NA"} }
                    }
                }
            ]).sort({ "avgRating": 1 });
        } else if (sort === "Most") {
            courses = await CourseModel.aggregate([
                { "$match": { "department": department._id } },
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
                        "avgRating": { "$avg": "$messages.rating" },
                        "numberOfMessages": { "$cond": { "if": { "$isArray": "$messages" }, "then": { "$size": "$messages" }, "else": "NA"} }
                    }
                }
            ]).sort({ "numberOfMessages": -1 });
        } else if (sort === "Least") {
            courses = await CourseModel.aggregate([
                { "$match": { "department": department._id } },
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
                        "avgRating": { "$avg": "$messages.rating" },
                        "numberOfMessages": { "$cond": { "if": { "$isArray": "$messages" }, "then": { "$size": "$messages" }, "else": "NA"} }
                    }
                }
            ]).sort({ "numberOfMessages": 1 });
        }
    } else if (filter_lvl && filter_department) { // If a filter level and department is selected ---------------------------------------------------------------------------------------------
        const department = await DepartmentModel.findOne({ department: filter_department });
        courses = await CourseModel.aggregate([
            { "$match": { "level": Number(filter_lvl), "department": department._id } },
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
        ]).sort({ "course": 1 });
    } else if (filter_lvl && sort) {    // If a filter level and sort is selected ---------------------------------------------------------------------------------------------
        if (sort === "High-rating") {
            courses = await CourseModel.aggregate([
                { "$match": { "level": Number(filter_lvl) } },
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
                        "avgRating": { "$avg": "$messages.rating" },
                        "numberOfMessages": { "$cond": { "if": { "$isArray": "$messages" }, "then": { "$size": "$messages" }, "else": "NA"} }
                    }
                }
            ]).sort({ "avgRating": -1 });
        } else if (sort === "Low-rating") {
            courses = await CourseModel.aggregate([
                { "$match": { "level": Number(filter_lvl) } },
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
                        "avgRating": { "$avg": "$messages.rating" },
                        "numberOfMessages": { "$cond": { "if": { "$isArray": "$messages" }, "then": { "$size": "$messages" }, "else": "NA"} }
                    }
                }
            ]).sort({ "avgRating": 1 });
        } else if (sort === "Most") {
            courses = await CourseModel.aggregate([
                { "$match": { "level": Number(filter_lvl) } },
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
                        "avgRating": { "$avg": "$messages.rating" },
                        "numberOfMessages": { "$cond": { "if": { "$isArray": "$messages" }, "then": { "$size": "$messages" }, "else": "NA"} }
                    }
                }
            ]).sort({ "numberOfMessages": -1 });
        } else if (sort === "Least") {
            courses = await CourseModel.aggregate([
                { "$match": { "level": Number(filter_lvl) } },
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
                        "avgRating": { "$avg": "$messages.rating" },
                        "numberOfMessages": { "$cond": { "if": { "$isArray": "$messages" }, "then": { "$size": "$messages" }, "else": "NA"} }
                    }
                }
            ]).sort({ "numberOfMessages": 1 });
        }
    } else if (filter_department) { // If a filter department is selected  ---------------------------------------------------------------------------------------------
        const department = await DepartmentModel.findOne({ department: filter_department });
        courses = await CourseModel.aggregate([
            { "$match": { "department": department._id } },
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
        ]).sort({ "course": 1 });
    } else if (filter_lvl) {    // If a filter level is selected
        courses = await CourseModel.aggregate([
            { "$match": { "level": Number(filter_lvl) } },
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
        ]).sort({ "course": 1 });
    } else if (sort) {  // If a sort is selected ---------------------------------------------------------------------------------------------
        if (sort === "High-rating") {
            courses = await CourseModel.aggregate([
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
                        "avgRating": { "$avg": "$messages.rating" },
                        "numberOfMessages": { "$cond": { "if": { "$isArray": "$messages" }, "then": { "$size": "$messages" }, "else": "NA"} }
                    }
                }
            ]).sort({ "avgRating": -1 });
        } else if (sort === "Low-rating") {
            courses = await CourseModel.aggregate([
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
                        "avgRating": { "$avg": "$messages.rating" },
                        "numberOfMessages": { "$cond": { "if": { "$isArray": "$messages" }, "then": { "$size": "$messages" }, "else": "NA"} }
                    }
                }
            ]).sort({ "avgRating": 1 });
        } else if (sort === "Most") {
            courses = await CourseModel.aggregate([
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
                        "avgRating": { "$avg": "$messages.rating" },
                        "numberOfMessages": { "$cond": { "if": { "$isArray": "$messages" }, "then": { "$size": "$messages" }, "else": "NA"} }
                    }
                }
            ]).sort({ "numberOfMessages": -1 });
        } else if (sort === "Least") {
            courses = await CourseModel.aggregate([
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
                        "avgRating": { "$avg": "$messages.rating" },
                        "numberOfMessages": { "$cond": { "if": { "$isArray": "$messages" }, "then": { "$size": "$messages" }, "else": "NA"} }
                    }
                }
            ]).sort({ "numberOfMessages": 1 });
        }
    } else { // Default sort by most->least number of messages   ---------------------------------------------------------------------------------------------
        courses = await CourseModel.aggregate([
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
                    "avgRating": { "$avg": "$messages.rating" },
                    "numberOfMessages": { "$cond": { "if": { "$isArray": "$messages" }, "then": { "$size": "$messages" }, "else": "NA"} }
                }
            }
        ]).sort({ "numberOfMessages": -1 });
    }

    const departments = await DepartmentModel.find().sort({ "department": 1 });
    if (res.locals.user) {
        if (res.locals.user.isAdmin) {
            return res.render(('index.ejs'), { Courses: courses, Departments: departments, isAdmin: true, filter_lvl: filter_lvl, filter_department: filter_department, sort: sort });
        };
    }
    res.render(('index.ejs'), { Courses: courses, Departments: departments, isAdmin: false, filter_lvl: filter_lvl, filter_department: filter_department, sort: sort });
});

module.exports = indexRouter;