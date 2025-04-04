const express = require("express");
const router = express.Router();
const crcwebresourceHandler = require("../../handler/crc/webresource");

router.post("/updateAll", crcwebresourceHandler.updateAll);

router.post("/create", crcwebresourceHandler.create);

router.post("/updateContent", crcwebresourceHandler.updateContent);

router.post("/updateOrder", crcwebresourceHandler.updateOrder);

router.post("/remove", crcwebresourceHandler.destroy);

module.exports = router;
