const express = require('express');
const path = require('path');

const userPageRouter = express.Router();

userPageRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'userPage.html'));
});

module.exports = userPageRouter;