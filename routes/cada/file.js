const express = require("express");
const router = express.Router();
const cadaFileHandler = require("../../handler/cada/file");

// 1) List All Cada Files (with optional ?page, ?pageSize, ?sortOrder, & ?search)
router.get("/", cadaFileHandler.findAll);

// 2) Get a Cada File by ID
//router.get("/:file_id", cadaFileHandler.getFileById);

// 3) Create Bulk Cada Files
router.post("/", cadaFileHandler.bulkCreate);

// 4) Delete Bulk Cada Files
router.delete("/", cadaFileHandler.bulkDelete);

// 5) Search for Cada Files by path
router.post("/search", cadaFileHandler.searchByPath);

router.get("/adibin", cadaFileHandler.processAdibin);
router.get("/hdf5", cadaFileHandler.processHdf5);
router.get("/pdf", cadaFileHandler.processPdf);
router.get("/json", cadaFileHandler.processJson);

module.exports = router;
