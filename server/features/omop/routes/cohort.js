const express = require("express");
const router = express.Router();
const h = require("../handlers/cohort");

router.get ("/",                                            h.findAll);
router.get ("/definition/:cohort_definition_id",            h.findByCohortDefinitionId);
router.post("/search",                                      h.advancedSearch);

module.exports = router;
