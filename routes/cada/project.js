const express = require("express");
const router = express.Router();
const cadaProjectHandler = require("../../handler/cada/project");

// Get all cadaProjects
router.get("/", cadaProjectHandler.findAll);
// Create a cadaProject
router.post("/", cadaProjectHandler.create);
// Find a cadaProject by id
router.get("/:pid", cadaProjectHandler.findById);
// Update a cadaProject by id
router.put("/:pid", cadaProjectHandler.update);
// Delete a cadaProject by id
router.delete("/:pid", cadaProjectHandler.delete);

// Get all cadaProjectUser role by UserId
router.get("/users/:uid", cadaProjectHandler.findProjectUserRolesByUserId);
// Get all cadaProjectUser role by ProjectId
router.get("/:pid/users", cadaProjectHandler.findProjectUserRolesByProjectId);
// Create a cadaProjectUser role
router.post("/:pid/users/:uid", cadaProjectHandler.createProjectUserRole);
// Find a cadaProjectUser role
router.get("/:pid/users/:uid", cadaProjectHandler.findProjectUserRole);
// Update a cadaProjectUser role
router.put("/:pid/users/:uid", cadaProjectHandler.updateProjectUserRole);
// Delete a cadaProjectUser role
router.delete("/:pid/users/:uid", cadaProjectHandler.deleteProjectUserRole);

module.exports = router;
