const express = require('express');
const path = require('path');

const userPageCommentsRouter = express.Router();

userPageCommentsRouter.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'userPageComments.html'));
});

module.exports = userPageCommentsRouter;