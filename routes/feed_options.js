const express = require("express");
var router = express.Router();
const globals = require("../functions/globals")
const User = require('../models/user');

router.get('/subscriptions', globals.ensure_authenticated, function (req, res) {
    res.render('options', { subscription: req.user.department_subscriptions});
})

router.post('/subscriptions', globals.ensure_authenticated, function(req, res) {
    let userSettings = {};
    let departments = globals.departments_json["departments"];

    Object.keys(departments).forEach(function (key) {
        userSettings[key] = (req.body[key] == 'on');
    })

    let error = "";

   User.findOneAndUpdate(req.user.username, {department_subscriptions: userSettings}, {upsert: true}, function (error, doc) {
       if(error){
          this.error = error;
       }
    })

    if(error) {
       req.flash('error_msg', error);
    }
    else {
        req.flash('success_msg', 'Subscriptions updated.');
    }


    res.redirect('/feed/subscriptions');
});

module.exports = router;