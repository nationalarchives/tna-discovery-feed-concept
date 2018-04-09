const express = require("express");
var router = express.Router();
const globals = require("../functions/globals")
const User = require('../models/user');

router.get('/subscriptions', globals.ensure_authenticated, function (req, res) {
    res.render('options', { subscription: req.user.department_subscriptions, taxonomy: req.user.taxonomy_subscriptions});
})

router.post('/subscriptions/departments', globals.ensure_authenticated, function(req, res) {
    let userDepartments = {};
    let departments = globals.departments_json["departments"];

    Object.keys(departments).forEach(function (key) {
        userDepartments[key] = (req.body[key] == 'on');
    })


    update_user_data(req, res, {department_subscriptions: userDepartments});

});

router.post('/subscriptions/taxonomies', globals.ensure_authenticated, function(req, res) {
    let userTaxonomies = {};
    let taxonomies = require("../data/empty_taxonomy_subscriptions.json");

    Object.keys(taxonomies).forEach(function (key) {
        userTaxonomies[key] = (req.body[key] == 'on');
    })

    update_user_data(req, res, {taxonomy_subscriptions: userTaxonomies});


});

function update_user_data(req, res, data) {
    User.findOneAndUpdate({"username" : req.user.username}, data, {upsert: true}, function (error, doc) {
        if(!error){
            req.flash('success_msg', 'Subscriptions updated.');
        }
        else {
            req.flash('error_msg', error);
        }

        res.redirect('/feed/subscriptions');
    })
}

module.exports = router;