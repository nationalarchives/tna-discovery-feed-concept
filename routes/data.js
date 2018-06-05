const express = require("express");
const router = express.Router();
const globals = require("../functions/globals")

router.get("/departments-json", function (req, res) {
    res.sendFile(__dirname + "/data/departments.json");
})

router.get("/filtered-json", function (req, res) {
    res.send(JSON.stringify(globals.discovery_json));
})

module.exports = router;