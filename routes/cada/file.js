const express = require("express");
const router = express.Router();
const cadaFileHandler = require("../../handler/cada/file");

// Find all cadaFiles with search string
router.get("/", cadaFileHandler.findAll);
// Create cadaFiles
router.post("/", cadaFileHandler.bulkCreate);
// Process Adibin file
router.get("/adibin", cadaFileHandler.processAdibin);
// Process HDF5 file
router.get("/hdf5", cadaFileHandler.processHdf5);
// Process PDF file
router.get("/pdf", cadaFileHandler.processPdf);
// Process JSON file
router.get("/json", cadaFileHandler.processJson);
// Process TXT file
// router.get("/txt", cadaFileHandler.processTxt);

module.exports = router;
