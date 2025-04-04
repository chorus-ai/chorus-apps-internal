const express = require("express");
const router = express.Router();
const surveyHandler = require("../../handler/survey/survey");

router.get("/:fid", surveyHandler.findAll);

router.get("/:fid/:uid", surveyHandler.findByUser);

router.get("/public/:fid", surveyHandler.findPublic);

router.get("/admin/:fid", surveyHandler.findAdmin);

router.post("/", surveyHandler.create);

router.post("/users", surveyHandler.createSurveyUsers);

router.put("/:sid", surveyHandler.update);

router.delete("/", surveyHandler.delete);

module.exports = router;