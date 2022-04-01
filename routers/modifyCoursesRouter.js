const express = require('express');
const path = require('path');

const modifyCoursesRouter = express.Router();

modifyCoursesRouter.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'modifyCourses.html'));
});

module.exports = modifyCoursesRouter;