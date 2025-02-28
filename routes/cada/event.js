const express = require("express");
const router = express.Router();
const cadaEventHandler = require("../../handler/cada/event");

router.get("/", cadaEventHandler.findAll);

router.post("/", cadaEventHandler.create);

router.delete("/", cadaEventHandler.delete);

router.get("/count", cadaEventHandler.count);

router.get("/assignments", cadaEventHandler.findAssignments);

router.post("/assignments", cadaEventHandler.createAssignments);

router.delete("/assignments", cadaEventHandler.deleteAssignments);

router.get("/assignmentsCount", cadaEventHandler.countAssignments);

router.post("/annotationValue", cadaEventHandler.createAnnotationValue);

router.post("/adjudicationValue", cadaEventHandler.createAdjudicationValue);

router.post("/annotators", cadaEventHandler.findAnnotators);

router.post("/adjudicators", cadaEventHandler.findAdjudicators);

router.get("/progress/:pid", cadaEventHandler.findAnnotatorProgress);

module.exports = router;
