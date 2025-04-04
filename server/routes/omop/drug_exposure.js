// routes/omop/drug_exposure.js
const express = require("express");
const router = express.Router();
const drugExposureHandler = require("../../handler/omop/drug_exposure");

// 1. List All Drug Exposures
router.get("/", drugExposureHandler.findAll);

// 2. Get Drug Exposure by Person ID
router.get("/person/:person_id", drugExposureHandler.findByPersonId);

// 3. Get Drug Exposures by Array of Person IDs
router.post("/person/ids", drugExposureHandler.findByPersonIds);

// 4. Get Drug Exposure by Visit Occurrence ID
router.get("/visit/:visit_occurrence_id", drugExposureHandler.findByVisitOccurrenceId);

// 5. Get Drug Exposures by Array of Visit Occurrence IDs
router.post("/visit/ids", drugExposureHandler.findByVisitOccurrenceIds);

// 6. Advanced Search
router.post("/search", drugExposureHandler.advancedSearch);

module.exports = router;
