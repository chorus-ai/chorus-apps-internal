const express = require("express");
const router = express.Router();
const cbwActivityHandler = require("../../handler/cbw/activity");

router.get("/:pid", cbwActivityHandler.findByPhaseId);

router.post("/create", cbwActivityHandler.create);

router.post("/create/content", cbwActivityHandler.createContent);

router.put("/update/:aid", cbwActivityHandler.update);

router.post("/update/order", cbwActivityHandler.updateOrder);

router.put("/update/content/:cid", cbwActivityHandler.updateContent);

router.post("/update/order/content", cbwActivityHandler.updateContentOrder);

router.delete("/:aid", cbwActivityHandler.delete);

router.delete("/content/:cid", cbwActivityHandler.deleteContent);

module.exports = router;