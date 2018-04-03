const express = require("express");
const router = express.Router();
const globals = require("../functions/globals")
// Get index
router.get('/', globals.ensure_authenticated, function (req, res) {
    res.render('index', {departments: "Hello"});

})

module.exports = router;