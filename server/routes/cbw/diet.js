const express = require("express");
const router = express.Router();
const cbwDietHandler = require("../../handler/cbw/diet");

router.get("/:pid", cbwDietHandler.findByPhaseId);

router.post("/create", cbwDietHandler.create);

router.post("/create/content", cbwDietHandler.createContent);

router.put("/update/:did", cbwDietHandler.update);

router.post("/update/order", cbwDietHandler.updateOrder);

router.put("/update/content/:cid", cbwDietHandler.updateContent);

router.post("/update/order/content", cbwDietHandler.updateContentOrder);

router.delete("/:did", cbwDietHandler.delete);

router.delete("/content/:cid", cbwDietHandler.deleteContent);

module.exports = router;