const express = require("express");
const router  = express.Router();
const h       = require("../handlers/visit_occurrence");

router.get ("/",                                    h.findAll);
router.get ("/person/:person_id",                   h.findByPersonId);
router.get ("/visit/:visit_occurrence_id",          h.findByVisitOccurrenceId);
router.post("/search",                              h.advancedSearch);

module.exports = router;
