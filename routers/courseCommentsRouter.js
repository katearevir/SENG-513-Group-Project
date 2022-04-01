const express = require('express');
const path = require('path');

const courseCommentsRouter = express.Router();

courseCommentsRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'courseComments.html'));
});

module.exports = courseCommentsRouter;