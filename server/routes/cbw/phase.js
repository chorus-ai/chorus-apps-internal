const express = require("express");
const router = express.Router();
const cbwPhaseHandler = require("../../handler/cbw/phase");

router.get("/", cbwPhaseHandler.findAll);

router.get("/:order", cbwPhaseHandler.findByOrder);

router.get("/user/:uid", cbwPhaseHandler.findByUserProgress);

router.put("/create", cbwPhaseHandler.create);

router.get("/create/progress/:uid", cbwPhaseHandler.createUserProgress);

router.delete("/:pid", cbwPhaseHandler.delete);

router.post("/update", cbwPhaseHandler.update);

module.exports = router;