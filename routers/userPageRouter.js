const express = require('express');
const path = require('path');
const { requireLogin } = require('../middleware/authMiddleware');
const userPageRouter = express.Router();

userPageRouter.get('/userPage', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'userPage.html'));
});

module.exports = userPageRouter;