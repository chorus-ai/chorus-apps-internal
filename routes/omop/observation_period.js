// routes/omop/observation_period.js
const express = require("express");
const router = express.Router();
const observationPeriodHandler = require("../../handler/omop/observation_period");

// 1) List All Observation Periods
router.get("/", observationPeriodHandler.findAll);

// 2) Get Observation Period by Person ID
router.get("/person/:person_id", observationPeriodHandler.findByPersonId);

// 3) Get Observation Periods by Array of Person IDs
router.post("/person/ids", observationPeriodHandler.findByPersonIds);

// 4) Search for Observation Periods by Date Range
router.post("/search", observationPeriodHandler.advancedSearch);

module.exports = router;
