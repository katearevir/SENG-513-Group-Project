const express = require('express');
const path = require('path');

const reviewRouter = express.Router();

reviewRouter.get('/review', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'review.html'));
});

module.exports = reviewRouter;