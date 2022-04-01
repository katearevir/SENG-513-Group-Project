const express = require('express');
const path = require('path');

const moderatorRouter = express.Router();

moderatorRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'moderator.html'));
});

module.exports = moderatorRouter;