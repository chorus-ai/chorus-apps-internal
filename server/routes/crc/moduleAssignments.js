const express = require("express");
const router = express.Router();
const crcassignmentHandler = require("../../handler/crc/assignment");

router.post("/updateAll", crcassignmentHandler.updateAll);

router.post("/create", crcassignmentHandler.create);

router.post("/updateContent", crcassignmentHandler.updateContent);

router.post("/updateOrder", crcassignmentHandler.updateOrder);

router.post("/remove", crcassignmentHandler.destroy);

module.exports = router;
