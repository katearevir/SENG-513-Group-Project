const express = require('express');
const path = require('path');

const addCourseRouter = express.Router();

addCourseRouter.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'addCourse.html'));
});

module.exports = addCourseRouter;