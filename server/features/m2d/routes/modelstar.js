const express = require("express");
const router = express.Router();

const m2dmodelstarHandler = require("../handlers/modelstar");

router.get("/getByModelId/:mid", m2dmodelstarHandler.findByModelId);

router.get("/getByUserId/:uid", m2dmodelstarHandler.findByUserId);

router.get("/getStarStatus/:uid/:mid", m2dmodelstarHandler.findStarStatus);

router.post("/create", m2dmodelstarHandler.create);

router.post("/remove", m2dmodelstarHandler.remove);

module.exports = router;