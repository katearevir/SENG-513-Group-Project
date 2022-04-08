const express = require('express');
const path = require('path');
const { requireLogin, requireAdmin } = require('../middleware/authMiddleware');

const addDepartmentRouter = express.Router();

addDepartmentRouter.get('/addDepartment', requireLogin, requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'addDepartment.html'));
});

module.exports = addDepartmentRouter;