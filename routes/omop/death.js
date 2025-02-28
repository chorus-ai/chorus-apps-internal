// routes/omop/death.js
const express = require("express");
const router = express.Router();
const deathHandler = require("../../handler/omop/death");

// 1. List All Death Records
router.get("/", deathHandler.findAll);

// 2. Get Death Record by Person ID
router.get("/person/:person_id", deathHandler.findByPersonId);

// 3. Get Death Records by Array of Person IDs
router.post("/person/ids", deathHandler.findByPersonIds);

// 4. Search for Death Records by Various Attributes
router.post("/search", deathHandler.advancedSearch);

module.exports = router;
