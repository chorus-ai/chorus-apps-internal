// routes/omop/cohort.js
const express = require("express");
const router = express.Router();
const cohortHandler = require("../../handler/omop/cohort");

// 1. List All Cohorts
router.get("/", cohortHandler.findAll);

// 2. Get All Subjects in a Cohort
router.get("/:cohort_definition_id", cohortHandler.findByCohortDefinition);

module.exports = router;
