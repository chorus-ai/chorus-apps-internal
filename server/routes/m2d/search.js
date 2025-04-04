const express = require("express");
const router = express.Router();
const m2dsearchHandler = require("../../handler/m2d/search");

router.post("/", m2dsearchHandler.search);

module.exports = router;
