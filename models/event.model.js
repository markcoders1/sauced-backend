const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
	{
		eventName: {
			type: String,
			required: true,
		},
		eventDetails: {
			type: [String], // array of strings for bullet points
			required: true,
		},
		eventDate: {
			type: String,
			required: true,
		},
		owner: {
			type: mongoose.Schema.ObjectId, // which brand is hosting event
			ref: "users",
			required: true,
		},
		venueName: {
			type: String,
			// required: true,
		},
		venueDescription: {
			type: String,
			// required: true,
		},
		venueLocation: {
			longitude: String,
			latitude: String,
		},
	},
	{ timestamps: true }
);

module.exports = {
	Event: mongoose.model("events", EventSchema),
};
