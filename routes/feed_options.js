const express = require("express");
var router = express.Router();
const globals = require("../functions/globals")
const User = require('../models/user');

router.get('/options', globals.ensure_authenticated, function (req, res) {
    res.render('options');
})

router.post('/options', globals.ensure_authenticated, function(req, res) {
    let userSettings = {};
    let departments = globals.departments_json["departments"];

    Object.keys(departments).forEach(function (key) {
        userSettings[key] = (req.body[key] == 'on');
    })

   User.findOneAndUpdate(req.user.username, {department_subscriptions: userSettings}, {upsert: true}, function (error, doc) {
       if(error){
           req.flash('success_msg', 'Error: subscriptions were not updated.');
           console.log(error);
       }
       else {
           req.flash('success_msg', 'Subscriptions updated.');
       }
    })


    res.redirect('/feed/options');
});

module.exports = router;