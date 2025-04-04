const express = require("express");
const router = express.Router();
const cbwPermissionHandler = require("../../handler/cbw/permission");

router.get("/", cbwPermissionHandler.findAll);

router.get("/:uid", cbwPermissionHandler.findByUserId);

router.put("/", cbwPermissionHandler.create);

router.delete("/:uid", cbwPermissionHandler.delete);

module.exports = router;