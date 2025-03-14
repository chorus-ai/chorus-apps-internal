// routes/omop/visit_detail.js
const express = require("express");
const router = express.Router();
const visitDetailHandler = require("../../handler/omop/visit_detail");

// 1. List All Visit Details
router.get("/", visitDetailHandler.findAll);

// 2. Get Visit Detail by Person ID
router.get("/person/:person_id", visitDetailHandler.findByPersonId);

// 3. Get Visit Details by Array of Person IDs
router.post("/person/ids", visitDetailHandler.findByPersonIds);

// 4. Get Visit Detail by Visit Occurrence ID
router.get("/visit/:visit_occurrence_id", visitDetailHandler.findByVisitOccurrenceId);

// 5. Get Visit Details by Array of Visit Occurrence IDs
router.post("/visit/ids", visitDetailHandler.findByVisitOccurrenceIds);

// 6. Search Visit Details by Attributes
router.post("/search", visitDetailHandler.advancedSearch);

module.exports = router;
