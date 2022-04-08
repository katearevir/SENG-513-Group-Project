const express = require('express');
const path = require('path');
const { requireLogin, requireAdmin } = require('../middleware/authMiddleware');

const modifyCoursesRouter = express.Router();

modifyCoursesRouter.get('/modifyCourses', requireLogin, requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'modifyCourses.html'));
});

module.exports = modifyCoursesRouter;