const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const FollowSchema = new Schema(
	{
		followGiver: {
			type: Schema.Types.ObjectId, // one who is following
			ref: "users",
		},
		followReciever: {
			type: Schema.Types.ObjectId, // the one who gets followed
			ref: "users",
		},
	},
	{ timestamps: true }
);

const BlockSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId, // current user
			ref: "users",
		},
		blockList: [
			{
				type: Schema.Types.ObjectId, // blocked users
				ref: "users",
			},
		],
	},
	{ timestamps: true }
);

module.exports = {
	Follow: mongoose.model("follows", FollowSchema),
	Block: mongoose.model("blocks", BlockSchema),
};
