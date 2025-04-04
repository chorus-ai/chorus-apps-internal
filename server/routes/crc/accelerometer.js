const express = require("express");
const router = express.Router();
const crcaccelerometerHandler = require("../../handler/crc/accelerometer");

router.get("/findAllByUserId/:uid", crcaccelerometerHandler.findAllByUserId);

router.post("/create", crcaccelerometerHandler.create);

router.post("/bulkCreate", crcaccelerometerHandler.bulkCreate);

module.exports = router;