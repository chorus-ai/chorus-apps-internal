const express = require("express");
const router = express.Router();
const h = require("../handlers/cohort_definition");

router.get ("/",                                   h.findAll);
router.get ("/:cohort_definition_id(\\d+)",        h.findById);
router.post("/search",                             h.advancedSearch);

module.exports = router;
