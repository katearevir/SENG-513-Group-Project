const express = require('express');
const path = require('path');
const { requireLogin, requireAdmin } = require('../middleware/authMiddleware');

const modifyCoursesRouter = express.Router();

modifyCoursesRouter.get('/modifyCourses', requireLogin, requireAdmin, (req, res) => {
    res.render("../views/modifyCourses.ejs");
});

module.exports = modifyCoursesRouter;