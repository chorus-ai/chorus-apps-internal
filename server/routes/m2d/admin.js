const express = require("express");
const router = express.Router();
const m2dadminHandler = require("../../handler/m2d/admin");

router.post("/getAllUsers", m2dadminHandler.findAllM2dUsers);

router.post("/editUser", m2dadminHandler.editUser);

router.post("/searchUser", m2dadminHandler.searchUser);

router.post("/getAllProjects", m2dadminHandler.findAllPendingProjects);

router.post("/approveProject", m2dadminHandler.approveProject);

router.post("/rejectProject", m2dadminHandler.rejectProject);

router.post("/searchProject", m2dadminHandler.searchProject);

router.post("/getAllModels", m2dadminHandler.findAllPendingModels);

router.post("/approveModel", m2dadminHandler.approveModel);

router.post("/rejectModel", m2dadminHandler.rejectModel);

router.post("/addUser", m2dadminHandler.createUser);

module.exports = router;
