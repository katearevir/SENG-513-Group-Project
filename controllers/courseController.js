let courseModel = require("../models/course.js");

let CourseQueries = {
    //find a specific course
    findCourse: async (req, res) => {
        let courseFound = await courseModel.find({ course: req.params.course });
        res.json(courseFound);
    },

    //find all courses
    allCourses: async (req, res) => {
        let allCoursesList = await courseModel.find();
        res.json(allCoursesList);
    },

    //create new courses? may use different method depending on if this actually works
    createCourses: async (req, res) => {
        let newCourse = new courseModel(req.body);
        let savedCourse = await newCourse.save();
        res.json(savedCourse);
    },

    //find all the messages about a course
    getAllCommentsForCourse: async (req, res) => {
        let foundCommentsForCourse = await courseModel.find({ course: req.params.course }).populate("messages");
        res.json(foundCommentsForCourse);
    }

}

module.exports = CourseQueries;