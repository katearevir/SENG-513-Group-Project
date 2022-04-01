const express = require('express');
const path = require('path');

const addDepartmentRouter = express.Router();

addDepartmentRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'addDepartment.html'));
});

module.exports = addDepartmentRouter;