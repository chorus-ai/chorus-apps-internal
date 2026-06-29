const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer();
require("events").EventEmitter.defaultMaxListeners = 100;

const m2dmodelHandler = require("../handlers/model");

// get all models
router.get("/", m2dmodelHandler.findAll);

router.post("/getModelById", m2dmodelHandler.findById);

router.post("/getAllModelNamesAndIdsByUserId", m2dmodelHandler.findAllModelNamesAndIdsByUserId);

router.post("/getUnapprovedModels", m2dmodelHandler.findUnapprovedModelsByUserId);

router.get("/getAllModelInputTypes", m2dmodelHandler.findAllModelInputTypes);

router.get("/getAllModelResultTypes", m2dmodelHandler.findAllModelResultTypes);

router.get("/getModelByUserId/:uid", m2dmodelHandler.findByUserId);

router.post("/test", upload.any("files"), m2dmodelHandler.test);

router.post("/vpptest", m2dmodelHandler.vpptest);

router.post("/createModel", upload.any("files"), m2dmodelHandler.create);

router.post("/editModel", m2dmodelHandler.edit);

router.post("/createModelCard", m2dmodelHandler.createModelCard);

router.post("/removeModel", m2dmodelHandler.remove);

router.post("/search", m2dmodelHandler.search);

module.exports = router;
