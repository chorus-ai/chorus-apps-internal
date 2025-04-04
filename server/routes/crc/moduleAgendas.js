const express = require("express");
const router = express.Router();
const crcagendaHandler = require("../../handler/crc/agenda");

router.get("/getAllFormats", crcagendaHandler.findAllFormats);

router.post("/updateFormats", crcagendaHandler.updateFormats);

router.post("/updateContents", crcagendaHandler.updateContents);

router.post("/updateTitle", crcagendaHandler.updateTitle);

router.post("/update", crcagendaHandler.update);

router.post("/create", crcagendaHandler.create);

module.exports = router;
