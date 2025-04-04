const express = require("express");
const router = express.Router();
const crcassignmentcontentHandler = require("../../handler/crc/assignmentcontent");

router.get("/getByContentId/:cid", crcassignmentcontentHandler.findByContentId);

router.post("/update", crcassignmentcontentHandler.update);

router.post("/create", crcassignmentcontentHandler.create);

router.post("/createUserAssignmentContent", crcassignmentcontentHandler.createUserAssignmentContent);

router.get("/remove/:aid", crcassignmentcontentHandler.remove);

router.post("removeUserAssignmentContent", crcassignmentcontentHandler.removeUserAssignmentContent);


module.exports = router;