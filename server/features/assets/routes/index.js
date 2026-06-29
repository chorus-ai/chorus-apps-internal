const express = require("express");
const router = express.Router();
const handler = require("../handlers/assets");

// 1. List all
router.get("/", handler.findAll);

// 2. Search
router.get("/search", handler.search);

// 3. Get by id
router.get("/:id", handler.getById);

// 4. Bulk insert
router.post("/bulk", handler.bulkCreate);

// 5. Update single
router.put("/:id", handler.updateById);

// 6. Delete single
router.delete("/:id", handler.deleteById);

// 7. Bulk delete
router.delete("/bulk", handler.bulkDelete);

module.exports = router;
