const express = require("express");
const router = express.Router();
const omopConceptHandler = require("../../handler/omop/concept");

router.get("/", omopConceptHandler.findAll);

router.get("/search", omopConceptHandler.searchByName);

module.exports = router;