const express = require("express");
const router = express.Router();
const cadaAdminHandler = require("../../handler/cada/admin");

router.get("/", cadaAdminHandler.findAll);

module.exports = router;
