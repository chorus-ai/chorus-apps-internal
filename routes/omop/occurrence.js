const express = require("express");
const router = express.Router();
const omopOccurrenceHandler = require("../../handler/omop/occurrence");

router.get("/condition", omopOccurrenceHandler.findAllConditions);

router.get("/procedure", omopOccurrenceHandler.findAllProcedures);

module.exports = router;