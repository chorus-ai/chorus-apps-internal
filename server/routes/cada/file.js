const express = require("express");
const router = express.Router();
const cadaFileHandler = require("../../handler/cada/file");

// Static routes first
router.get("/adibin", cadaFileHandler.processAdibin);
router.get("/hdf5", cadaFileHandler.processHdf5);
router.get("/pdf", cadaFileHandler.processPdf);
router.get("/json", cadaFileHandler.processJson);

// Then your resource routes
// 1) List All Cada Files
router.get("/", cadaFileHandler.findAll);

// 5) Search for Cada Files by path
router.post("/search", cadaFileHandler.searchByPath);

// 3) Create Bulk Cada Files
router.post("/", cadaFileHandler.bulkCreate);

// 4) Delete Bulk Cada Files
router.delete("/", cadaFileHandler.bulkDelete);

// 2) Get a Cada File by ID (dynamic route)
router.get("/:file_id", cadaFileHandler.getFileById);

module.exports = router;
