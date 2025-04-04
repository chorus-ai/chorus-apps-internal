// routes/omop/condition_occurrence.js
const express = require("express");
const router = express.Router();
const conditionOccurrenceHandler = require("../../handler/omop/condition_occurrence");

// 1. List All Condition Occurrences
router.get("/", conditionOccurrenceHandler.findAll);

// 2. Get Condition Occurrence by Person ID
router.get("/person/:person_id", conditionOccurrenceHandler.findByPersonId);

// 3. Get Condition Occurrences by Array of Person IDs
router.post("/person/ids", conditionOccurrenceHandler.findByPersonIds);

// 4. Get Condition Occurrence by Visit Occurrence ID
router.get("/visit/:visit_occurrence_id", conditionOccurrenceHandler.findByVisitOccurrenceId);

// 5. Get Condition Occurrences by Array of Visit Occurrence IDs
router.post("/visit/ids", conditionOccurrenceHandler.findByVisitOccurrenceIds);

// 6. Search for Condition Occurrences
router.post("/search", conditionOccurrenceHandler.advancedSearch);

module.exports = router;
