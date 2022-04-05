const express = require('express');
const path = require('path');

const courseCommsModRouter = express.Router();

courseCommsModRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'courseCommsMod.html'));
});

module.exports = courseCommsModRouter;