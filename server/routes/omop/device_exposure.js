// routes/omop/device_exposure.js
const express = require("express");
const router = express.Router();
const deviceExposureHandler = require("../../handler/omop/device_exposure");

// 1. List All Device Exposures
router.get("/", deviceExposureHandler.findAll);

// 2. Get Device Exposure by Person ID
router.get("/person/:person_id", deviceExposureHandler.findByPersonId);

// 3. Get Device Exposures by Array of Person IDs
router.post("/person/ids", deviceExposureHandler.findByPersonIds);

// 4. Get Device Exposure by Visit Occurrence ID
router.get("/visit/:visit_occurrence_id", deviceExposureHandler.findByVisitOccurrenceId);

// 5. Get Device Exposures by Array of Visit Occurrence IDs
router.post("/visit/ids", deviceExposureHandler.findByVisitOccurrenceIds);

// 6. Search Device Exposures by Attributes
router.post("/search", deviceExposureHandler.advancedSearch);

module.exports = router;
