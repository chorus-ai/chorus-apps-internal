// routes/omop/cohort_definition.js
const express = require("express");
const router = express.Router();
const cohortDefinitionHandler = require("../../handler/omop/cohort_definition");

// 1. List All Cohort Definitions
router.get("/", cohortDefinitionHandler.findAll);

// 2. Get Cohort Definition by ID
router.get("/:cohort_definition_id", cohortDefinitionHandler.findById);

// 3. Text Search in Cohort Definitions
router.post("/search", cohortDefinitionHandler.search);

module.exports = router;
