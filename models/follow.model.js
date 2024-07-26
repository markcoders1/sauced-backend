const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const FollowSchema = new Schema(
	{
		followGiver: {
			type: Schema.Types.ObjectId, // one who is following
			ref: "users",
			required: true,
		},
		followReciever: {
			type: Schema.Types.ObjectId, // the one who gets followed
			ref: "users",
			required: true,
		},
	},
	{ timestamps: true }
);

const BlockSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId, // current user
			ref: "users",
			required: true,
		},
		blockList: [
			{
				type: Schema.Types.ObjectId, // blocked users
				ref: "users",
				required: true,
			},
		],
	},
	{ timestamps: true }
);

module.exports = {
	Follow: mongoose.model("follows", FollowSchema),
	Block: mongoose.model("blocks", BlockSchema),
};
