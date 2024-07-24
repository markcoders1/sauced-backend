const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const SauceSchema = new Schema(
	{
		// uid: {
		//     type: String,
		//     required: true,
		// },
		// brand:{
		//     type: String,
		//     required: true,
		// },
		owner: {
			type: Schema.Types.ObjectId,
			ref: "users", // make it brands after making brand schema
			required: true,
		},
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
		isRequested: {
			type: Boolean,
			default: false,
			required: true,
		},
		isFeatured:{
			type:Boolean,
			default:false,
			required:true
		},
		image: {
			type: String,
		},
		views: {
			type: Number,
			default: 0,
		},
		// likedBy: {
		// 	type: Array,
		// 	default: [],
		// },
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
		// date: {
		// 	type: Date,
		// 	default: Date.now,
		// },
	},
	{ timestamps: true }
);

const LikeSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
		sauceId: {
			type: Schema.Types.ObjectId,
			ref: "sauces",
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = {
	Sauce: mongoose.model("sauces", SauceSchema),
	Like: mongoose.model("likes", LikeSchema),
};
