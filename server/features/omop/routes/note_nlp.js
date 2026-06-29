const express = require("express");
const router  = express.Router();
const h       = require("../handlers/note_nlp");

router.get ("/",                                    h.findAll);
router.get ("/note/:note_id",                       h.findByNoteId);
router.post("/search",                              h.advancedSearch);

module.exports = router;
