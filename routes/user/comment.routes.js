const express = require("express");
const {
	createComment,
	addReply,
	getCommentWithReplies,
	editComment,
	deleteComment,
} = require("../../controllers/user/comment.controller.js");
const authMiddleware = require("../../middlewares/auth.middleware.js");
const router = express.Router();

router.post("/create-comment", authMiddleware, createComment);
router.post("/add-reply", authMiddleware, addReply);
router.get("/get-comment", authMiddleware, getCommentWithReplies);
router.put("/edit-comment", authMiddleware, editComment);
router.delete("/delete-comment", authMiddleware, deleteComment);

module.exports = router;
