// routes/omop/note.js
const express = require("express");
const router = express.Router();
const noteHandler = require("../../handler/omop/note");

// 1. List All Notes
router.get("/", noteHandler.findAll);

// 2. Get Note by Person ID
router.get("/person/:person_id", noteHandler.findByPersonId);

// 3. Get Notes by Array of Person IDs
router.post("/person/ids", noteHandler.findByPersonIds);

// 4. Get Note by Visit Occurrence ID
router.get("/visit/:visit_occurrence_id", noteHandler.findByVisitOccurrenceId);

// 5. Get Notes by Array of Visit Occurrence IDs
router.post("/visit/ids", noteHandler.findByVisitOccurrenceIds);

// 6. Search Notes by Attributes
router.post("/search", noteHandler.advancedSearch);

module.exports = router;
