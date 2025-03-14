// routes/omop/note_nlp.js
const express = require("express");
const router = express.Router();
const noteNlpHandler = require("../../handler/omop/note_nlp");

// 1. List All Note NLP Entries
router.get("/", noteNlpHandler.findAll);

// 2. Get Note NLP by Note ID
router.get("/note/:note_id", noteNlpHandler.findByNoteId);

// 3. Get Note NLP by Array of Note IDs
router.post("/note/ids", noteNlpHandler.findByNoteIds);

// 4. Search Note NLP Entries by Attributes
router.post("/search", noteNlpHandler.advancedSearch);

module.exports = router;
