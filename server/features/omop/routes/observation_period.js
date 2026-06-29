const express = require("express");
const router  = express.Router();
const h       = require("../handlers/observation_period");

router.get ("/",                                    h.findAll);
router.get ("/person/:person_id",                   h.findByPersonId);
router.post("/search",                              h.advancedSearch);

module.exports = router;
