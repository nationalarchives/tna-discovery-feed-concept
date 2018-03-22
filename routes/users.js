const express = require("express");
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const {check, validationResult} = require('express-validator/check');

router.get('/register', function (req, res) {
    res.render('register');
})

router.post('/register', [
    check('name').isLength({min:1}).withMessage("Name must contain a value."),
    check('username').isLength({min:1}).withMessage("Username must contain a value."),
    check('password').isLength({min:1}).withMessage("Password must contain a value."),
    check('email').isEmail().withMessage("Email is invalid.")
], (req, res) => {

    const errors = validationResult(req);
    let name = req.body.name;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;

    if(!errors.isEmpty()) {
       res.render('register', {errors: errors.mapped()});
    }
    else {
        var newUser = new User( {
            name, email, username, password
        });

        User.createUser(newUser, function (error, user) {
            if(error){ throw error }
            console.log(user);
        });

        req.flash("success_msg", "You have registered.");
        res.redirect("/users/login");
    }
})

router.get('/login', function (req, res) {
    res.render('login');
})

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(error, user) {
        done(error, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function (error, user) {
            if(error){ throw error; }

            if(!user) {
                return done(null, false, {message: 'User does not exist.'});
            }

            User.comparePassword(password, user.password, function (error, isMatch) {
                if(error) { throw error};

                if(isMatch) {
                    return done(null, user);
                }
                else {
                    return done(null, false, {message: 'Invalid password'})
                }
            })
        });
    }
));

router.post('/login',
    //Local = local strategy.
    passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
    function(req, res) {
        res.redirect('/')
    });

router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success_msg', 'You have logged out.');
    res.redirect('/users/login');
});

module.exports = router;