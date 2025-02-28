// routes/omop/observation.js
const express = require("express");
const router = express.Router();
const observationHandler = require("../../handler/omop/observation");

// 1. List All Observations
router.get("/", observationHandler.findAll);

// 2. Get Observation by Person ID
router.get("/person/:person_id", observationHandler.findByPersonId);

// 3. Get Observations by Array of Person IDs
router.post("/person/ids", observationHandler.findByPersonIds);

// 4. Get Observation by Visit Occurrence ID
router.get("/visit/:visit_occurrence_id", observationHandler.findByVisitOccurrenceId);

// 5. Get Observations by Array of Visit Occurrence IDs
router.post("/visit/ids", observationHandler.findByVisitOccurrenceIds);

// 6. Advanced Search
router.post("/search", observationHandler.advancedSearch);

module.exports = router;
