const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer();
require("events").EventEmitter.defaultMaxListeners = 100;
const foodImageHandler = require("../../handler/diet/foodimage");

router.post("/:uid", upload.any("files"), foodImageHandler.processFoodImage);

module.exports = router;