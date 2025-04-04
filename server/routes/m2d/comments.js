const express = require("express");
const router = express.Router();
const m2dcommentHandler = require("../../handler/m2d/comment");

router.post("/getCommentsByModel", m2dcommentHandler.findByModel);

router.post("/getCommentsByProject", m2dcommentHandler.findByProject);

router.post("/getCommentsByParentId", m2dcommentHandler.findByParentId);

router.post("/getReplyComments", m2dcommentHandler.findRepliesByUserId);

router.post("/getCommentsToMyProjects", m2dcommentHandler.findByProjectByUserId);

router.post("/getCommentsToMyModels", m2dcommentHandler.findByModelByUserId);

router.post("/addComment", m2dcommentHandler.create);

router.post("/delete", m2dcommentHandler.remove);

module.exports = router;
