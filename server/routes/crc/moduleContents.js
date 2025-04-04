const express = require("express");
const router = express.Router();
const crccontentHandler = require("../../handler/crc/content");

router.post("/updateAll", crccontentHandler.updateAll);

router.post("/create", crccontentHandler.create);

router.post("/updateContent", crccontentHandler.updateContent);

router.post("/updateOrder", crccontentHandler.updateOrder);

router.post("/remove", crccontentHandler.destroy);

module.exports = router;