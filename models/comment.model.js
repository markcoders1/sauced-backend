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
				user: {
					type: Schema.Types.ObjectId,
					ref: "users",
					required: true,
				},
				text: {
					type: String,
					required: true,
				},
				createdAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	{ timestamps: true }
);

module.exports = {
	Comment: mongoose.model("comments", CommentSchema),
};
