const { Comment } = require("../../models/comment.model.js");
const User = require("../../models/user.model.js");

// Create a root-level first comment
const createComment = async (req, res) => {
	try {
		const newComment = new Comment({
			user: req.user._id, // Assuming user ID is available in req.user
			text: req.body.text,
		});
		const savedComment = await newComment.save();
		await savedComment.populate("user", "name"); // Populate user's name

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

		const newReply = new Comment({
			user: req.user._id,
			text: req.body.text,
			parentComment: parentComment._id,
		});

		const savedReply = await newReply.save();

		// Update the parent comment's replies array
		await Comment.findByIdAndUpdate(parentComment._id, {
			$push: { replies: savedReply._id },
		});

		await savedReply.populate("user", "name");

		res.status(201).json({
			message: "Reply Added Successfully",
			reply: savedReply,
		});
	} catch (error) {
		console.error("Error adding reply:", error);
		res.status(400).json({
			message: "Something went wrong while adding the reply",
			error,
		});
	}
};

// Fetch a comment and its replies recursively
const getCommentWithReplies = async (req, res) => {
	try {
		const commentId = req.query.commentId;

		const populateRepliesRecursively = async (comment) => {
			// Populate the immediate replies for the current comment
			await comment.populate({
				path: "replies",
				populate: {
					path: "user",
					select: "name",
				},
			});

			// For each reply, recursively populate its replies
			for (let reply of comment.replies) {
				await populateRepliesRecursively(reply);
			}

			return comment;
		};

		const comment = await Comment.findById(commentId).populate(
			"user",
			"name"
		);

		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		// Populate the comment with all its nested replies
		const fullCommentThread = await populateRepliesRecursively(comment);

		res.status(200).json({ comment: fullCommentThread });
	} catch (error) {
		console.error("Error fetching comment:", error);
		res.status(400).json({
			message: "Something went wrong while fetching the comment",
			error,
		});
	}
};

// Delete a comment and its replies
const deleteComment = async (req, res) => {
	try {
		const commentId = req.query.commentId; // Get commentId from query parameters
		const comment = await Comment.findById(commentId);

		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		// Check if the current user is the owner of the comment
		if (comment.user.toString() !== req.user._id.toString()) {
			return res.status(403).json({
				message: "You do not have permission to delete this comment",
			});
		}

		// Recursively delete all replies
		async function deleteReplies(commentId) {
			const comment = await Comment.findById(commentId);
			if (comment) {
				for (const replyId of comment.replies) {
					await deleteReplies(replyId);
				}
				await Comment.findByIdAndDelete(commentId);
			}
		}

		await deleteReplies(commentId);

		res.status(200).json({
			message: "Comment and its replies deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting comment:", error);
		res.status(400).json({
			message: "Something went wrong while deleting the comment",
			error,
		});
	}
};

// Edit user comment or reply
const editComment = async (req, res) => {
	try {
		const commentId = req.query.commentId;
		const comment = await Comment.findById(commentId);

		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		// Check if the current user is the owner of the comment
		if (comment.user.toString() !== req.user._id.toString()) {
			return res.status(403).json({
				message: "You do not have permission to edit this comment",
			});
		}

		// Update the comment text
		comment.text = req.body.text;
		const updatedComment = await comment.save();

		await updatedComment.populate("user", "name");

		res.status(200).json({
			message: "Comment Updated Successfully",
			comment: updatedComment,
		});
	} catch (error) {
		console.error("Error editing comment:", error);
		res.status(400).json({
			message: "Something went wrong while editing the comment",
			error,
		});
	}
};

module.exports = {
	createComment,
	addReply,
	getCommentWithReplies,
	deleteComment,
	editComment,
};
