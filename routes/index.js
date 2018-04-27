const express = require("express");
const router = express.Router();
const globals = require("../functions/globals")
// Get index
router.get('/', globals.ensure_authenticated, function (req, res) {
    res.render('index', {username: res.locals.user.username, departments: globals.return_object["departments"], updated_department: globals.updated_record_departments});

})

module.exports = router;