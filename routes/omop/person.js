const express = require("express");
const router = express.Router();
const omopPersonHandler = require("../../handler/omop/person");

router.get("/", omopPersonHandler.findAll);

router.get("/concept/:cid", omopPersonHandler.findByConcept);

module.exports = router;