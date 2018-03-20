const express = require("express");
var router = express.Router();
const globals = require("../functions/globals")

router.get('/options', globals.ensure_authenticated, function (req, res) {
    res.render('options');
})

module.exports = router;