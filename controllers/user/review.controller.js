const User = require("../../models/user.model.js");
const { Review } = require("../../models/review.model.js");
const mongoose = require("mongoose");

// create review
const createReview = async (req, res) => {
	try {
		const { sauceId, star, text } = req.body;
		if (!mongoose.isValidObjectId(sauceId)) {
			return res
				.status(400)
				.json({ message: "Invalid user id to follow" });
		}
		if (![1, 2, 3, 4, 5].includes(star)) {
			return res.status(400).json({
				message: "star must be a number from 1 to 5",
			});
		}
		const review = Review.create({
			owner: req.user?._id,
			sauceId: sauceId,
			star: star,
			text: text,
		});
		return res
			.status(200)
			.json({ message: "Review Created Successfully", review });
	} catch (error) {
		return res.status(400).json({
			message: "Something went wrong while creating a review",
		});
	}
};

// read review
const getUserReviews = async (req, res) => {
	try {
		const user = req.user;

		return res
			.status(200)
			.json({ message: "User Reviews returned Successfully", review });
	} catch (error) {
		return res.status(400).json({
			message: "Something went wrong while getting user reviews",
		});
	}
};

// update review
const updateReview = async (req, res) => {
	try {
		const user = req.user;

		return res
			.status(200)
			.json({ message: "Review updated Successfully", review });
	} catch (error) {
		return res.status(400).json({
			message: "Something went wrong while updating review",
		});
	}
};

// delete review
const deleteReview = async (req, res) => {
	try {
		const user = req.user;

		return res
			.status(200)
			.json({ message: "Review deleted Successfully", review });
	} catch (error) {
		return res.status(400).json({
			message: "Something went wrong while deleting review",
		});
	}
};

module.exports = {
	createReview,
	getUserReviews,
	updateReview,
	deleteReview,
};
