const express = require("express");
const router = express.Router();
const m2dcommentHandler = require("../../handler/m2d/comment");
const m2dresultHandler = require("../../handler/m2d/result");
const m2duserinfoHandler = require("../../handler/m2d/userinfo");

router.post("/getPendingJobs", m2dresultHandler.findByUserId);

router.post("/getComments", m2dcommentHandler.findAllByUserId);

router.get("/profile/:uid", m2duserinfoHandler.findUserWithProjectsAndModelsById);

module.exports = router;
