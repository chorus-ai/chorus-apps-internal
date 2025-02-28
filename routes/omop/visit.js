const express = require("express");
const router = express.Router();
const omopVisitHandler = require("../../handler/omop/visit");

router.get("/detail", omopVisitHandler.findAllDetail);

router.get("/occurrence", omopVisitHandler.findAllOccurrence);

module.exports = router;
