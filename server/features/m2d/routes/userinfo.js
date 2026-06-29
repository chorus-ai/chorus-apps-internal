const express = require("express");
const router = express.Router();
const m2dcommentHandler = require("../handlers/comment");
const m2dresultHandler = require("../handlers/result");
const m2duserinfoHandler = require("../handlers/userinfo");

router.post("/getPendingJobs", m2dresultHandler.findByUserId);

router.post("/getComments", m2dcommentHandler.findAllByUserId);

router.get("/profile/:uid", m2duserinfoHandler.findUserWithProjectsAndModelsById);

module.exports = router;
