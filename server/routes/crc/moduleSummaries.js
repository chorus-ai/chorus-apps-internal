const express = require("express");
const router = express.Router();
const crcsummaryHandler = require("../../handler/crc/summary");

router.post("/update", crcsummaryHandler.update);

module.exports = router;
