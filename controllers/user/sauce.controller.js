const { Sauce, Like } = require("../../models/sauce.model.js");
const { Checkin } = require("../../models/checkin.model.js");
const User = require("../../models/user.model.js");
const baseUrl = process.env.SERVER_BASE_URL || "/";
const fs = require("fs");

const changeSauceImage = async (req, res) => {
	try {
		if (!req.file) {
			console.log("Image not found");
			return res.status(400).json({ message: "Image not found" });
		}

		const { sauceId } = req.body;
		const userId = req.user._id;

		// Find the sauce by ID and ensure the user is the owner
		const sauce = await Sauce.findOne({ _id: sauceId, owner: userId });
		// const sauce = await Sauce.findOne({ _id: sauceId});
		if (!sauce) {
			return res.status(404).json({
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
		const { type } = req.query;
		const userId = req.user._id;

		let sauces;

		switch (type) {
			case "all":
				if (req.user.type !== "admin") {
					return res.status(403).json({
						message: "Access denied: Admins only",
					});
				}
				sauces = await Sauce.find({ isRequested: false }).populate(
					"owner"
				);
				return res.status(200).json({
					message: "All sauces retrieved successfully",
					sauces,
				});

			case "requested":
				if (req.user.type !== "admin") {
					return res.status(403).json({
						message: "Access denied: Admins only",
					});
				}
				sauces = await Sauce.find({ isRequested: true }).populate(
					"owner"
				);
				return res.status(200).json({
					message: "Requested sauces retrieved successfully",
					sauces,
				});
			case "favourite":
				const likes = await Like.find({ userId }).populate({
					path: "sauceId",
					populate: { path: "owner" },
				});
				sauces = likes.map((like) => like.sauceId);
				return res.status(200).json({
					message: "Liked sauces retrieved successfully",
					sauces,
				});

			case "toprated":
				sauces = await Sauce.find({ isRequested: false })
					.sort({ views: -1 }) // Sort by view count in descending order
					.limit(20) // Limit the results to the top 20
					.populate("owner");
				return res.status(200).json({
					message: "Top Rated sauces retrieved successfully",
					sauces,
				});

			case "featured":
				sauces = await Sauce.find({
					isFeatured: true,
					isRequested: false,
				}).populate("owner");
				return res.status(200).json({
					message: "Featured sauces retrieved successfully",
					sauces,
				});

			case "checkedin":
				sauces = await Checkin.find({ owner: userId }).populate({
					path: "sauceId",
					populate: { path: "owner" },
				});
				return res.status(200).json({
					message: "Checked-in sauces retrieved successfully",
					sauces,
				});

			default:
				return res.status(400).json({
					message:
						"Type can only be 'favourite', 'checkedin', 'featured', 'toprated' ('requested' or 'all' for admin only)",
				});
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: "Something went wrong while retrieving sauces",
			error: error.message,
		});
	}
};

// const getSauces = async (req, res) => {
// 	try {
// 		const { type } = req.body;
// 		const userId = req.user._id;

// 		// get all sauces user has liked
// 		if (type === "favourite") {
// 			const likes = await Like.find({ userId }).populate("sauceId");
// 			const likedSauces = likes.map((like) => like.sauceId);
// 			return res.status(200).json({
// 				message: "Liked sauces retrieved successfully",
// 				sauces: likedSauces,
// 			});
// 		}
// 		// get top 20 sauces with highest views
// 		if (type === "toprated") {
// 			const topRatedSauces = await Sauce.find({ isRequested: false })
// 				.sort({ views: -1 }) // Sort by view count in descending order
// 				.limit(20) // Limit the results to the top 20
// 				.populate("owner");
// 			return res.status(200).json({
// 				message: "Top Rated sauces retrieved successfully",
// 				sauces: topRatedSauces,
// 			});
// 		}
// 		// get all featured sauces
// 		if (type === "featured") {
// 			const featuredSauces = await Sauce.find({
// 				isFeatured: true,
// 				isRequested: false,
// 			}).populate("owner");
// 			return res.status(200).json({
// 				message: "Featured sauces retrieved successfully",
// 				featured: featuredSauces,
// 			});
// 		}
// 		// ignore this for now, checkin not being used
// 		if (type === "checkedin") {
// 			//! finish this when checkin logic is done
// 			return res.status(200).json({
// 				message: "Checked-in sauces retrieved successfully",
// 				// sauces: likedSauces,
// 			});
// 		}
// 		//! only admin should be able to get all sauces and get requested sauces
// 		if (req.user.type === "admin") {
// 			if (type === "requested") {
// 				const requestedSauces = await Sauce.find({ isRequested: true });
// 				return res.status(200).json({
// 					message: "Requested sauces retrieved successfully",
// 					sauces: requestedSauces,
// 				});
// 			}
// 			if (type == "" || !type || type === "all") {
// 				const notRequestedSauces = await Sauce.find({
// 					isRequested: false,
// 				}).populate('owner');
// 				return res.status(200).json({
// 					message: "All sauces retrieved successfully",
// 					sauces: notRequestedSauces,
// 				});
// 			}
// 		}

// 		return res.status(400).json({
// 			message:
// 				// "type can only be 'favourite', 'checkedin', 'featured', 'toprated' or 'requested'",
// 				"type can only be 'favourite', 'checkedin', 'featured' or 'toprated' ('requested' or 'all' for admin only)",
// 		});
// 	} catch (error) {
// 		return res
// 			.status(400)
// 			.json({ message: "Something went wrong while retrieving Sauces" });
// 	}
// };

module.exports = {
	requestSauce,
	likeSauce,
	viewSauce,
	getSauces,
	changeSauceImage,
};
