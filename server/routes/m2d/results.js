const express = require("express");
const router = express.Router();
const m2dresultHandler = require("../../handler/m2d/result");
const m2dmetricsHandler = require("../../handler/m2d/metrics");

router.get("/:rid", m2dresultHandler.findById);

router.get("/delete/:rid", m2dresultHandler.remove);

router.post("/saveMetrics", m2dmetricsHandler.create);

router.get("/getSavedMetrics/:rid", m2dmetricsHandler.findById);

module.exports = router;
