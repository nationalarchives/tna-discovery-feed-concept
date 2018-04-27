const express = require("express");
var router = express.Router();
const globals = require("../functions/globals")
const User = require('../models/user');

router.get('/subscriptions', globals.ensure_authenticated, function (req, res) {
    res.render('options', { subscription: req.user.department_subscriptions, taxonomy: req.user.taxonomy_subscriptions, keyword: req.user.keyword_subscriptions, username: res.locals.user.username});
})

router.post('/subscriptions/departments', globals.ensure_authenticated, function(req, res) {
    let userDepartments = {};
    let departments = globals.department_full_names;

    Object.keys(departments).forEach(function (key) {
        userDepartments[key] = (req.body[key] == 'on');
    })


    update_user_data(req, res, {department_subscriptions: userDepartments}, "department-h2");

});

router.post('/subscriptions/taxonomies', globals.ensure_authenticated, function(req, res) {
    let userTaxonomies = {};
    let taxonomies = require("../data/empty_taxonomy_subscriptions.json");

    Object.keys(taxonomies).forEach(function (key) {
        userTaxonomies[key] = (req.body[key] == 'on');
    })

    update_user_data(req, res, {taxonomy_subscriptions: userTaxonomies}, "taxonomy-h2");


});

router.post('/subscriptions/keywords', globals.ensure_authenticated, function (req, res) {
    if(req.body["keyword"]){
        update_user_data(req, res, {$push: {keyword_subscriptions: req.body["keyword"]}}, "keyword-h2");
    }
    else {
        res.redirect('/feed/subscriptions#keyword-h2');
    }

});

router.post('/subscriptions/keywords/delete', globals.ensure_authenticated, function (req, res) {
    let index_to_delete = req.body["keyword"];

    User.getUserByUsername(req.user.username, function (error, data) {
        let user_keyword_array = data["keyword_subscriptions"];

        user_keyword_array.splice(index_to_delete,1);

        update_user_data(req,res,{keyword_subscriptions: user_keyword_array}, "keyword-h2");

    });
});

function update_user_data(req, res, data, h2) {
    User.findOneAndUpdate({"username" : req.user.username}, data, {upsert: true}, function (error, doc) {
        if(!error){
            req.flash('success_msg', 'Subscriptions updated.');
        }
        else {
            req.flash('error_msg', error);
        }

        res.redirect('/feed/subscriptions'+'#'+h2);
    })
}

module.exports = router;