const express = require("express");
const router = express.Router();
const crcadminHandler = require("../../handler/crc/admin");

router.post("/updateUser", crcadminHandler.updateUser);

module.exports = router;