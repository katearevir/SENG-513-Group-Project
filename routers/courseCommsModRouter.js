const express = require('express');
const path = require('path');
const { requireLogin, requireAdmin } = require('../middleware/authMiddleware');

const courseCommsModRouter = express.Router();

courseCommsModRouter.get('/', requireLogin, requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'courseCommsMod.html'));
});

module.exports = courseCommsModRouter;