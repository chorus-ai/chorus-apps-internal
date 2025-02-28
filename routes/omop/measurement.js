const express = require("express");
const router = express.Router();
const omopMeasurementHandler = require("../../handler/omop/measurement");

router.get("/", omopMeasurementHandler.findAll);

router.get("/search", omopMeasurementHandler.search);

router.get("/person/:person_id", omopMeasurementHandler.findByPersonId);

router.post("/person/ids", omopMeasurementHandler.findByPersonIds);

router.get("/visit/:visit_occurrence_id", omopMeasurementHandler.findByVisitOccurrenceId);

router.post("/visit/ids", omopMeasurementHandler.findByVisitOccurrenceIds);

router.post("/search", omopMeasurementHandler.advancedSearch); 

module.exports = router;