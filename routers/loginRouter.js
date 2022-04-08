const express = require('express');
const path = require('path');

const loginRouter = express.Router();

loginRouter.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'login.html'));
});

module.exports = loginRouter;