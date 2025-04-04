const express = require("express");
const router = express.Router();
const crcformatHandler = require("../../handler/crc/format");

router.post("/create", crcformatHandler.create);

router.post("/edit", crcformatHandler.edit);

router.get("/remove/:fid", crcformatHandler.remove);

module.exports = router;