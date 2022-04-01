const express = require('express');
const path = require('path');

const indexRouter = express.Router();

indexRouter.get('/', function (req, res) {
    res.render(path.join(__dirname, '..', 'index.ejs'));
});

module.exports = indexRouter;