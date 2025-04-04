const express = require("express");
const router = express.Router();
const crclocationHandler = require("../../handler/crc/location");

router.get("/findAllByUserId/:uid", crclocationHandler.findAllByUserId);

router.post("/create", crclocationHandler.create);

router.post("/bulkCreate", crclocationHandler.bulkCreate);

module.exports = router;