const express = require("express");
const router = express.Router();
const crccompetenciesandevalHandler = require("../../handler/crc/competenciesandeval");

router.post("/update", crccompetenciesandevalHandler.updateAll);

router.post("/create", crccompetenciesandevalHandler.create);

router.post("/updateContent", crccompetenciesandevalHandler.updateContent);

router.post("/updateOrder", crccompetenciesandevalHandler.updateOrder);

router.post("/remove", crccompetenciesandevalHandler.destroy);

module.exports = router;
