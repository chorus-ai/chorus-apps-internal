const express = require("express");
const router = express.Router();
const formHandler = require("../../handler/form/form");

router.get("/", formHandler.findAll);

router.get("/:fid", formHandler.findById);

router.post("/", formHandler.create);;

router.post("/field", formHandler.createFormField);

router.post("/field/trigger", formHandler.createFormFieldTrigger);

router.post("/json", formHandler.createFromJSON);

router.put("/:fid", formHandler.updateForm);

router.put("/field/:ffid", formHandler.updateFormField);

router.post("/field/replace/:ffid", formHandler.replaceFormField);

router.put("/field/trigger/:fftid", formHandler.updateFormFieldTrigger);

router.put("/field/order", formHandler.updateFormFieldOrder);

router.delete("/:fid", formHandler.removeForm);

router.delete("/field/:ffid", formHandler.removeFormField);

module.exports = router;