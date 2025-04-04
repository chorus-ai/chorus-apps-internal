const express = require("express");
const router = express.Router();

const m2dprojectHandler = require("../../handler/m2d/project");

// get all projects
router.get("/", m2dprojectHandler.findAll);

// fixed showing associated models in projects
router.post("/getProjectById", m2dprojectHandler.findById);

router.post(
  "/getAllProjectNamesAndIdsByUserId",
  m2dprojectHandler.getAllProjectNamesAndIdsByUserId
);

router.post("/createProject", m2dprojectHandler.create);

router.post(
  "/getUnapprovedProjects",
  m2dprojectHandler.findUnapprovedProjectsByUserId
);

router.post("/editProject", m2dprojectHandler.edit);

router.post("/removeProject", m2dprojectHandler.remove);

module.exports = router;
