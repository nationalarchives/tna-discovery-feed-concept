const express = require("express");
var router = express.Router();
var User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;

router.get('/register', function (req, res) {
    res.render('register');
})

router.post('/register', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();

    // Check two fields: req.checkBody('password2', 'Passwords do not match').equals(req.body.password1);

    var errors = req.validationErrors();

    if(errors) {
       res.render('register', {errors});
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