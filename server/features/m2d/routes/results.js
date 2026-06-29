const express = require("express");
const router = express.Router();
const m2dresultHandler = require("../handlers/result");
const m2dmetricsHandler = require("../handlers/metrics");

router.get("/:rid", m2dresultHandler.findById);

router.get("/delete/:rid", m2dresultHandler.remove);

router.post("/saveMetrics", m2dmetricsHandler.create);

router.get("/getSavedMetrics/:rid", m2dmetricsHandler.findById);

module.exports = router;
