const express = require("express");
const router = express.Router();
const crcmoduleHandler = require("../../handler/crc/module");
const crcsummaryHandler = require("../../handler/crc/summary");
const crcagendaHandler = require("../../handler/crc/agenda");
const crclectureHandler = require("../../handler/crc/lecture");
const crccontentHandler = require("../../handler/crc/content");
const crcquestionHandler = require("../../handler/crc/question");
const crcwebresourceHandler = require("../../handler/crc/webresource");
const crcassignmentHandler = require("../../handler/crc/assignment");
const crccompetenciesandevalHandler = require("../../handler/crc/competenciesandeval");

router.post("/getModuleByRole", crcmoduleHandler.findByRole);

router.get("/getAllModuleContent/:mid", crcmoduleHandler.findById);

router.get("/getModuleSummary/:mid", crcsummaryHandler.findByModuleId);

router.get("/getModuleAgenda/:mid", crcagendaHandler.findByModuleId);

router.get("/getModuleLecture/:mid", crclectureHandler.findByModuleId);

router.get("/getModuleContent/:mid", crccontentHandler.findByModuleId);

router.get("/getModuleQuestion/:mid", crcquestionHandler.findByModuleId);

router.get("/getModuleWebResource/:mid", crcwebresourceHandler.findByModuleId);

router.get("/getModuleAssignment/:mid/:uid", crcassignmentHandler.findByModuleId);

router.get("/getModuleCompetenciesandeval/:mid", crccompetenciesandevalHandler.findByModuleId);

router.post("/setProgress", crcmoduleHandler.setModuleProgress);

router.post("/editModuleName", crcmoduleHandler.editModuleName);

router.get("/removeModule/:mid", crcmoduleHandler.remove);



module.exports = router;