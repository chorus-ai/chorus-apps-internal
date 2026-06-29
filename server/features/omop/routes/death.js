const express = require("express");
const router  = express.Router();
const h       = require("../handlers/death");

router.get ("/",                                    h.findAll);
router.get ("/person/:person_id",                   h.findByPersonId);
router.post("/search",                              h.advancedSearch);

module.exports = router;
