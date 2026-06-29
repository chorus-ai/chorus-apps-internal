// routes/cada/project.js
const express = require("express");
const router  = express.Router();
const cadaProjectHandler = require("../handlers/project");

router.get("/count", cadaProjectHandler.countAllProjects);
// Get all cadaProjects
router.get("/", cadaProjectHandler.findAll);
// Create a cadaProject
router.post("/", cadaProjectHandler.create);
// Create a cadaProject Form
router.post("/form/:pid/:fid", cadaProjectHandler.createProjectForm);
// Find a cadaProject by id
router.get("/:pid", cadaProjectHandler.findById);
// Update a cadaProject by id
router.put("/:pid", cadaProjectHandler.update);
// Delete a cadaProject by id
router.delete("/:pid", cadaProjectHandler.delete);

// ——— NEW COUNT ENDPOINTS ———
// Count all project-user roles for a user
router.get("/users/:uid/count", cadaProjectHandler.countProjectUserRolesByUserId);
// List all project-user roles for a user (with pagination)
router.get("/users/:uid",       cadaProjectHandler.findProjectUserRolesByUserId);

// Count all project-user roles for a project
router.get("/:pid/users/count", cadaProjectHandler.countProjectUserRolesByProjectId);
// List all project-user roles for a project (with pagination)
router.get("/:pid/users",       cadaProjectHandler.findProjectUserRolesByProjectId);

// Create a cadaProjectUser role
router.post("/:pid/users/:uid", cadaProjectHandler.createProjectUserRole);
// Find a cadaProjectUser role
router.get("/:pid/users/:uid",  cadaProjectHandler.findProjectUserRole);
// Update a cadaProjectUser role
router.put("/:pid/users/:uid",  cadaProjectHandler.updateProjectUserRole);
// Delete a cadaProjectUser role
router.delete("/:pid/users/:uid", cadaProjectHandler.deleteProjectUserRole);

module.exports = router;
