// routes/omop/procedureOccurrence.js
const express = require("express");
const router = express.Router();
const procedureOccurrenceHandler = require("../../handler/omop/procedure_occurrence");

// 1. List All Procedure Occurrences
router.get("/", procedureOccurrenceHandler.findAll);

// 2. Get Procedure Occurrence by Person ID
router.get("/person/:person_id", procedureOccurrenceHandler.findByPersonId);

// 3. Get Procedure Occurrences by Array of Person IDs
router.post("/person/ids", procedureOccurrenceHandler.findByPersonIds);

// 4. Get Procedure Occurrence by Visit Occurrence ID
router.get("/visit/:visit_occurrence_id", procedureOccurrenceHandler.findByVisitOccurrenceId);

// 5. Get Procedure Occurrences by Array of Visit Occurrence IDs
router.post("/visit/ids", procedureOccurrenceHandler.findByVisitOccurrenceIds);

// 6. Advanced Search
router.post("/search", procedureOccurrenceHandler.advancedSearch);

module.exports = router;
