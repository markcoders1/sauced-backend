const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const SauceSchema = new Schema({
	// uid: {
	//     type: String,
	//     required: true,
	// },
	// brand:{
	//     type: String,
	//     required: true,
	// },
	name: {
		type: String,
		required: true,
	},
	title: {
		type: String,
	},
	type: {
		type: String,
	},
	description: {
		type: String,
	},
	ingredients: {
		type: Array,
		default: [],
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: "users",
		required: true,
	},
	isRequested: {
		type: Boolean,
		default: false,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	image: {
		type: String,
	},
	likedBy: {
		type: Array,
		default: [],
	},
	checkIn: {
		type: Number,
		default: 0,
	},
	websiteLink: {
		type: String,
	},
	productLink: {
		type: String,
	},
});

// module.exports = mongoose.model("sauces", SauceSchema);
module.exports = {
	Sauce: mongoose.model("sauces", SauceSchema),
};
