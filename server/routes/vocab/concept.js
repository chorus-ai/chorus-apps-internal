const express = require("express");
const router = express.Router();
const vocabConceptHandler = require("../../handler/vocab/concept");

router.get("/:cid", vocabConceptHandler.findById);

router.get("/", vocabConceptHandler.findAll);

router.get("/search", vocabConceptHandler.searchByName);

module.exports = router;