const express = require("express");
const router = express.Router();
const crcquestionHandler = require("../../handler/crc/question");

router.post("/update", crcquestionHandler.updateAll);

router.post("/create", crcquestionHandler.create);

router.post("/updateContent", crcquestionHandler.updateContent);

router.post("/updateOrder", crcquestionHandler.updateOrder);

router.post("/remove", crcquestionHandler.destroy);

module.exports = router;
