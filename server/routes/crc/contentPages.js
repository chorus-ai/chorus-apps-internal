const express = require("express");
const router = express.Router();
const crccontentpageHandler = require("../../handler/crc/contentpage");

router.get("/getByContentId/:cid", crccontentpageHandler.findByContentId);

router.post("/update", crccontentpageHandler.update);

router.post("/create", crccontentpageHandler.create);

router.get("/remove/:cid", crccontentpageHandler.remove);


module.exports = router;