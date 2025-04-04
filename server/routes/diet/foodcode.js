const express = require("express");
const router = express.Router();
const foodCodeHandler = require("../../handler/diet/foodcode");

// Find a FoodCode by code
router.get("/:code", foodCodeHandler.findByCode);
// Find all food codes
router.post("/", foodCodeHandler.findByCodes);
// Find a FoodCode by description
router.get("/search/:query", foodCodeHandler.search);

module.exports = router;