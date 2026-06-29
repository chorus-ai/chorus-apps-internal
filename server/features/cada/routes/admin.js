const express = require("express");
const router = express.Router();
const cadaAdminHandler = require("../handlers/admin");

router.get("/", cadaAdminHandler.findAll);

module.exports = router;
