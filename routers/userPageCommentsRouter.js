const express = require('express');
const path = require('path');
const { requireLogin } = require('../middleware/authMiddleware');
const userPageCommentsRouter = express.Router();

userPageCommentsRouter.get('/', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'userPageComments.html'));
});

module.exports = userPageCommentsRouter;