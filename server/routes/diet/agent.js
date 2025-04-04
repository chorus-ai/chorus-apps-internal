const express = require("express");
const router = express.Router();
const agentHandler = require("../../handler/diet/agent");

router.post("/:uid/:sid", agentHandler.agent);

module.exports = router;