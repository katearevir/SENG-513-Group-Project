const express = require('express');
const path = require('path');
const { requireLogin, requireAdmin } = require('../middleware/authMiddleware');

const addCourseRouter = express.Router();

addCourseRouter.get('/addCourse', requireLogin, requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'addCourse.html'));
});

module.exports = addCourseRouter;