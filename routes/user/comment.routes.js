const express = require("express");
const {
	createComment,
	addReply,
	getCommentWithReplies,
	deleteComment,
    editComment,
} = require("../../controllers/user/comment.controller.js");
const authMiddleware = require("../../middlewares/auth.middleware.js");
const router = express.Router();

router.post("/create-comment", authMiddleware, createComment);
router.post("/add-reply", authMiddleware, addReply);
router.get("/get-comment", authMiddleware, getCommentWithReplies);
router.delete("/delete-comment", authMiddleware, deleteComment);
router.put("/edit-comment", authMiddleware, editComment);

module.exports = router;
