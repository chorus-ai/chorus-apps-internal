const express = require("express");
const router = express.Router();
const omopPersonHandler = require("../../handler/omop/person");

router.get("/:pid", omopPersonHandler.findById);

router.get("/", omopPersonHandler.findAll);

router.get("/concept/:cid", omopPersonHandler.findByConcept);

router.post("/ids", omopPersonHandler.findByIds);

router.post("/search", omopPersonHandler.search);

module.exports = router;