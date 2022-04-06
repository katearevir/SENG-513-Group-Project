const express = require('express');
const path = require('path');
const { requireLogin, requireAdmin } = require('../middleware/authMiddleware');

const moderatorRouter = express.Router();

moderatorRouter.get('/', requireLogin, requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'moderator.html'));
});

module.exports = moderatorRouter;