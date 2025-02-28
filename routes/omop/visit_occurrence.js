const express = require("express");
const router = express.Router();
const visitOccurrenceHandler = require("../../handler/omop/visit_occurrence");

// 1. List All Visit Occurrences
router.get("/", visitOccurrenceHandler.findAll);

// 2. Get Visit Occurrence by Person ID
router.get("/person/:person_id", visitOccurrenceHandler.findByPersonId);

// 3. Get Visit Occurrences by Array of Person IDs
router.post("/person/ids", visitOccurrenceHandler.findByPersonIds);

// 4. Get Visit Occurrence by Visit Occurrence ID
router.get("/:visit_occurrence_id", visitOccurrenceHandler.findByVisitOccurrenceId);

// 5. Get Visit Occurrences by Array of Visit Occurrence IDs
router.post("/ids", visitOccurrenceHandler.findByVisitOccurrenceIds);

// 6. Search for Visit Occurrences by Various Attributes
router.post("/search", visitOccurrenceHandler.advancedSearch);

module.exports = router;
