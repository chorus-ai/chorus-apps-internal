const express = require("express");
const router = express.Router();
const logHandler = require("../handler/log.js");


router.post("/create", logHandler.create);

router.get("/findByUserId/:uid", logHandler.findByUserId);

router.get("/findById/:lid", logHandler.findById);

router.post("/findByAction", logHandler.findByAction);

module.exports = router;
