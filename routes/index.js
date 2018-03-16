const express = require("express");
var router = express.Router();

// Get index
router.get('/', function (req, res) {
    res.render('index');
})

module.exports = router;