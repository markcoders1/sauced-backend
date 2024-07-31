const { Comment } = require("../../models/comment.model.js");
const User = require("../../models/user.model.js");

// Create a root-level comment
const createComment = async (req, res) => {
	try {
		const newComment = new Comment({
			user: req.user._id,
			text: req.body.text,
		});
		const savedComment = await newComment.save();
		await savedComment.populate("user", "name");

		res.status(201).json({
			message: "Comment Created Successfully",
			comment: savedComment,
		});
	} catch (error) {
		console.error("Error creating comment:", error);
		res.status(400).json({
			message: "Something went wrong while creating the comment",
			error,
		});
	}
};

// Add a reply to a comment
const addReply = async (req, res) => {
	try {
		const commentId = req.query.commentId;
		const parentComment = await Comment.findById(commentId);
		if (!parentComment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		const newReply = {
			user: req.user._id,
			text: req.body.text,
		};

		parentComment.replies.push(newReply);
		await parentComment.save();
		await parentComment.populate("replies.user", "name");

		res.status(201).json({
			message: "Reply Added Successfully",
			comment: parentComment,
		});
	} catch (error) {
		console.error("Error adding reply:", error);
		res.status(400).json({
			message: "Something went wrong while adding the reply",
			error,
		});
	}
};

// Fetch a comment and its replies
const getCommentWithReplies = async (req, res) => {
	try {
		const commentId = req.query.commentId;
		const comment = await Comment.findById(commentId)
			.populate("user", "name")
			.populate("replies.user", "name");

		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		res.status(200).json({ comment });
	} catch (error) {
		console.error("Error fetching comment:", error);
		res.status(400).json({
			message: "Something went wrong while fetching the comment",
			error,
		});
	}
};

// Edit a comment or reply
const editComment = async (req, res) => {
	try {
		const commentId = req.query.commentId;
		const comment = await Comment.findById(commentId);

		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		// Check if editing a reply
		const replyId = req.query.replyId;
		if (replyId) {
			const reply = comment.replies.id(replyId);
			if (!reply) {
				return res.status(404).json({ message: "Reply not found" });
			}
			if (reply.user.toString() !== req.user._id.toString()) {
				return res.status(403).json({
					message: "You do not have permission to edit this reply",
				});
			}
			reply.text = req.body.text;
		} else {
			if (comment.user.toString() !== req.user._id.toString()) {
				return res.status(403).json({
					message: "You do not have permission to edit this comment",
				});
			}
			comment.text = req.body.text;
		}

		await comment.save();
		await comment.populate("user", "name");
		await comment.populate("replies.user", "name");

		res.status(200).json({
			message: "Comment Updated Successfully",
			comment,
		});
	} catch (error) {
		console.error("Error editing comment:", error);
		res.status(400).json({
			message: "Something went wrong while editing the comment",
			error,
		});
	}
};

// Delete a comment or reply
const deleteComment = async (req, res) => {
	try {
		const commentId = req.query.commentId;
		const comment = await Comment.findById(commentId);

		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		// Check if deleting a reply
		const replyId = req.query.replyId;
		if (replyId) {
			const reply = comment.replies.id(replyId);
			if (!reply) {
				return res.status(404).json({ message: "Reply not found" });
			}
			if (reply.user.toString() !== req.user._id.toString()) {
				return res.status(403).json({
					message: "You do not have permission to delete this reply",
				});
			}
			comment.replies = comment.replies.filter(
				(r) => r._id.toString() !== replyId
			);
			await comment.save();
		} else {
			if (comment.user.toString() !== req.user._id.toString()) {
				return res.status(403).json({
					message:
						"You do not have permission to delete this comment",
				});
			}
			await Comment.findByIdAndDelete(commentId);
		}

		res.status(200).json({
			message: "Comment or reply deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting comment or reply:", error);
		res.status(400).json({
			message: "Something went wrong while deleting the comment or reply",
			error,
		});
	}
};

module.exports = {
	createComment,
	addReply,
	getCommentWithReplies,
	editComment,
	deleteComment,
};
