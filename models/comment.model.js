const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
		text: {
			type: String,
			required: true,
			trim: true,
		},
		replies: [
			{
				type: Schema.Types.ObjectId,
				ref: "comments",
			},
		],
		parentComment: {
			type: Schema.Types.ObjectId,
			ref: "comments",
			default: null, // Used to track parent comment for replies
		},
	},
	{ timestamps: true }
);

// Middleware to update the updatedAt field on save
CommentSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

module.exports = {
	Comment: mongoose.model("comments", CommentSchema),
};
