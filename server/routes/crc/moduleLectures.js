const express = require("express");
const router = express.Router();
const crclectureHandler = require("../../handler/crc/lecture");

router.post("/create", crclectureHandler.create);

router.post("/bulkCreate", crclectureHandler.bulkCreate);

router.post("/update", crclectureHandler.update);

router.post("/remove", crclectureHandler.remove);

module.exports = router;