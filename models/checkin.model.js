const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const CheckinSchema = new Schema(
	{
		owner: {
			// the person checking in
			type: Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
		sauceId: {
			// the sauce being checkin
			type: Schema.Types.ObjectId,
			ref: "sauces",
			required: true,
		},
		text: {
			type: String,
			required: true,
			trim: true,
		},
		location: {
			longitude: String,
			latitude: String,
		},
		images: [
			{
				type: String,
				trim: true,
			},
		],
	},
	{ timestamps: true }
);

module.exports = {
	Checkin: mongoose.model("checkins", CheckinSchema),
};
