const jwt = require('jsonwebtoken');
const User = require('../models/user');

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        // temp jwt secret
        jwt.verify(token, process.env.JWT_SECRET || 'cat', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

const requireLogin = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        // temp jwt secret
        jwt.verify(token, process.env.JWT_SECRET || 'cat', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                // console.log("Need to be logged in");
                res.redirect('/');
            } else {
                // console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/');
    }
};

const requireAdmin = async (req, res, next) => {
    if (!res.locals.user.isAdmin) {
        // console.log("Need to be admin");
        return res.redirect('/');
    }
    next();
};

module.exports = { checkUser, requireLogin, requireAdmin };