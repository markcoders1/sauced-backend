const { Sauce, Like } = require("../../models/sauce.model.js");
const User = require("../../models/user.model.js");

//! move addSauce to admin
const addSauce = async (req, res) => {
	try {
		const { name, title, type, description, ingredients } = req.body;
		// add sauce to db
		if (!name) {
			return res.status(400).json({ message: "Sauce name is required" });
		}
		const user = await User.findOne({ email: req.user.email });
		const sauce = await Sauce.create({
			isRequested: false,
			title: title,
			name: name,
			type: type,
			owner: user.id,
			description: description,
			ingredients: ingredients,
		});

		return res.status(200).json({
			message: "Sauce Added Successfully",
			sauce,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: "Something went wrong while Adding Sauce",
			error,
		});
	}
};

const requestSauce = async (req, res) => {
	try {
		// make sure other API only use false value sauces because
		// this is not a sauce just a request for that sauce
		const { name, title, description } = req.body;
		if (!name) {
			return res.status(400).json({ message: "Sauce name is required" });
		}
		const user = await User.findOne({ email: req.user.email });
		const sauce = await Sauce.create({
			isRequested: true,
			title: title,
			name: name,
			owner: user.id,
			description: description,
		});
		return res
			.status(200)
			.json({ message: "Sauce Request Submitted Successfully", sauce });
	} catch (error) {
		return res.status(400).json({
			message: "Something went wrong while Submitting a sauce request",
		});
	}
};

const likeSauce = async (req, res) => {
	try {
		//like sauce, and unlike it if its already liked, return with sauce's like count
		const { sauceId } = req.body;
		const userId = req.user._id;

		const existingLike = await Like.findOne({ userId, sauceId });
		if (existingLike) {
			await Like.findOneAndDelete({ userId, sauceId });
			const likeCount = await Like.countDocuments({ sauceId });
			return res.status(200).json({
				message: "Sauce unliked successfully",
				likeCount: likeCount,
			});
		} else {
			const like = await Like.create({ userId, sauceId });
			const likeCount = await Like.countDocuments({ sauceId });
			return res.status(200).json({
				message: "Sauce liked successfully",
				like,
				likeCount: likeCount,
			});
		}
	} catch (error) {
		return res.status(400).json({
			message: "Something went wrong while toggling the like status",
		});
	}
};

const viewSauce = async (req, res) => {
	try {
		// Find the sauce by ID and increment the views count by 1
		const { sauceId } = req.body;
		const sauce = await Sauce.findByIdAndUpdate(
			sauceId,
			{ $inc: { views: 1 } },
			{ new: true }
		);
		if (!sauce) {
			return res.status(404).json({ message: "Sauce not found" });
		}
		return res.status(200).json({
			message: "Sauce viewed successfully",
			sauce,
		});
	} catch (error) {
		return res.status(400).json({
			message: "Something went wrong while viewing the sauce",
		});
	}
};

module.exports = {
	addSauce,
	requestSauce,
	likeSauce,
	viewSauce,
};
