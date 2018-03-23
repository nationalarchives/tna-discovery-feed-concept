const express = require("express");
var router = express.Router();
const globals = require("../functions/globals")

router.get('/options', globals.ensure_authenticated, function (req, res) {
    res.render('options');
})

router.post('/options', globals.ensure_authenticated, function(req, res) {
    let userSettings = {};
    let departments = globals.departments_json["departments"];

    Object.keys(departments).forEach(function (key) {
        userSettings[key] = (req.body[key] == 'on');
    })

    req.flash('success_msg', 'Post successful.');
    res.redirect('/feed/options');
});

module.exports = router;