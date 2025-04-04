// routes/ive/layout.js
const express = require("express");
const router = express.Router();
const layoutHandler = require("../../handler/ive/layout");

// 1. List All Layout Configurations
router.get("/", layoutHandler.findAll);

// 2. Get a Layout Configuration by ID
router.get("/:layout_id", layoutHandler.findById);

// 3. Create a New Layout Configuration
router.post("/", layoutHandler.create);

// 4. Update an Existing Layout Configuration
router.put("/:layout_id", layoutHandler.update);

// 5. Delete a Layout Configuration
router.delete("/:layout_id", layoutHandler.delete);

// 6. Search for Layouts by Name
router.post("/search", layoutHandler.searchByName);

module.exports = router;
