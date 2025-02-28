const express = require("express");
const router = express.Router();
const omopExposureHandler = require("../../handler/omop/exposure");

router.get("/drug", omopExposureHandler.findAllDrugs);

router.get("/device", omopExposureHandler.findAllDevices);

module.exports = router;