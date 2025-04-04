const express = require("express");
const router = express.Router();
const cbwaccesstokenHandler = require("../../handler/cbw/accesstoken");

router.get("/:uid", cbwaccesstokenHandler.findByUserId);

router.post("/", cbwaccesstokenHandler.create);

module.exports = router;