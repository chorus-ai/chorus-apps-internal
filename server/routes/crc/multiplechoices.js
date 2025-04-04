const express = require("express");
const router = express.Router();
const crcmultiplechoiceHandler = require("../../handler/crc/multiplechoice");

router.get("/findByModuleId/:mid", crcmultiplechoiceHandler.findByModuleId);

router.post("/create", crcmultiplechoiceHandler.create);

router.post("/bulkCreate", crcmultiplechoiceHandler.bulkCreate);

router.post("/remove", crcmultiplechoiceHandler.remove);

router.get("/removeAll/:mid", crcmultiplechoiceHandler.removeAll);

router.post("/update", crcmultiplechoiceHandler.update);

router.post("/recordScore", crcmultiplechoiceHandler.recordScore);

module.exports = router;
