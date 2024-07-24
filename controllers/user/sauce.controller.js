const { Sauce, Like } = require("../../models/sauce.model.js");
const User = require("../../models/user.model.js");
const baseUrl = process.env.SERVER_BASE_URL || "/";
const fs = require("fs");

//! move addSauce to admin
const addSauce = async (req, res) => {
	try {
		const { name, title, type, description, ingredients } = req.body;
		// add sauce to db
		if (!name) {
			return res.status(400).json({ message: "Sauce name is required" });
		}

		if (!req.file) {
			console.log("Image not found");
			return res.status(400).json({ message: "Image not found" });
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
			image: baseUrl + "uploads/" + req.file.filename
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

const changeSauceImage = async (req, res) => {
	try {
		if (!req.file) {
			console.log("Image not found");
			return res.status(400).json({ message: "Image not found" });
		}

		const { sauceId } = req.body;
		const userId = req.user._id;

		// Find the sauce by ID and ensure the user is the owner
		//! const sauce = await Sauce.findOne({ _id: sauceId, owner: userId });
		const sauce = await Sauce.findOne({ _id: sauceId});
		if (!sauce) {
			return res
				.status(404)
				.json({
					message:
						"Sauce not found or you do not have permission to update this sauce",
				});
		}

		sauce.image = baseUrl + "uploads/" + req.file.filename;
		const updatedSauce = await sauce.save();

		return res.status(200).json({
			message: "Sauce Image Updated Successfully",
			sauce: updatedSauce,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: "Something went wrong while changing sauce image",
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
		const detailedSauce = await sauce.populate("owner", "name email image");
		return res.status(200).json({
			message: "Sauce viewed successfully",
			sauce: detailedSauce,
		});
	} catch (error) {
		return res.status(400).json({
			message: "Something went wrong while viewing the sauce",
		});
	}
};

const getSauces = async (req, res) => {
	try {
		const { type } = req.body;
		const userId = req.user._id;

		if (type === "favourite") {
			const likes = await Like.find({ userId }).populate("sauceId");
			const likedSauces = likes.map((like) => like.sauceId);
			return res.status(200).json({
				message: "Liked sauces retrieved successfully",
				sauces: likedSauces,
			});
		}
		if (type === "toprated") {
			const topRatedSauces = await Sauce.find()
				.sort({ views: -1 }) // Sort by view count in descending order
				.limit(20); // Limit the results to the top 20
			return res.status(200).json({
				message: "Top Rated sauces retrieved successfully",
				sauces: topRatedSauces,
			});
		}
		if (type === "featured") {
			//! test this again when admin creates featured sauces array
			const featuredSauces = await Sauce.find({ isFeatured: true });
			return res.status(200).json({
				message: "Featured sauces retrieved successfully",
				featured: featuredSauces,
			});
		}
		if (type === "checkedin") {
			//! finish this when checkin logic is done
			return res.status(200).json({
				message: "Checked-in sauces retrieved successfully",
				// sauces: likedSauces,
			});
		}
		//! only admin should be able to get all sauces and get requested sauces
		// if (type === "requested") {
		// 	const requestedSauces = await Sauce.find({ isRequested: true });
		// 	return res.status(200).json({
		// 		message: "Requested sauces retrieved successfully",
		// 		sauces: requestedSauces,
		// 	});
		// }
		// if (type == "" || !type) {
		// 	const notRequestedSauces = await Sauce.find({ isRequested: false });
		// 	return res.status(200).json({
		// 		message: "All sauces retrieved successfully",
		// 		sauces: notRequestedSauces,
		// 	});
		// }
		return res.status(400).json({
			message:
				// "type can only be 'favourite', 'checkedin', 'featured', 'toprated' or 'requested'",
				"type can only be 'favourite', 'checkedin', 'featured' or 'toprated'",
		});
	} catch (error) {
		return res
			.status(400)
			.json({ message: "Something went wrong while retrieving Sauces" });
	}
};

module.exports = {
	addSauce,
	requestSauce,
	likeSauce,
	viewSauce,
	getSauces,
	changeSauceImage,
};
