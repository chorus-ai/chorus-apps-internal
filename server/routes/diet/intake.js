const express = require("express");
const router = express.Router();
const intakeHandler = require("../../handler/diet/intake");

router.get("/:uid", intakeHandler.findByUser);

router.get("/:id", intakeHandler.findById);

router.post("/", intakeHandler.create);

router.post("/:id", intakeHandler.update);

router.delete("/:id", intakeHandler.delete);

module.exports = router;