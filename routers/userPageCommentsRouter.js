const express = require('express');
const { requireLogin } = require('../middleware/authMiddleware');
const userPageCommentsRouter = express.Router();
const UserModel = require('../models/user');

userPageCommentsRouter.get('/userPageComments', requireLogin, (req, res) => {
    UserModel.findOne({ _id: res.locals.user.id }).populate({ path: 'messages', populate: { path: 'course' }}).exec((err, user) => {
        if (err) return handleError(err);
        res.render(('userPageComments.ejs'), { user: user, isAdmin: false });
    });

});

module.exports = userPageCommentsRouter;