const express = require("express");
const router = express.Router();
const crcpermissionHandler = require("../../handler/crc/permission");

router.get("/findByUserId/:uid", crcpermissionHandler.findByUserId);

router.post("/create", crcpermissionHandler.create);

router.delete("/:id", crcpermissionHandler.remove);

router.post("/removeByType", crcpermissionHandler.removeByType);

router.post("/update", crcpermissionHandler.update);

router.post("/bulkCreate", crcpermissionHandler.bulkCreate);

module.exports = router;