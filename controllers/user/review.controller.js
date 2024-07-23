const User = require("../../models/user.model.js");
const { Review } = require("../../models/review.model.js");
const mongoose = require("mongoose");

// create review
const createReview = async (req, res) => {
	try {
		const { sauceId, star, text } = req.body;
		if (!mongoose.isValidObjectId(sauceId)) {
			return res.status(400).json({ message: "Invalid sauce id" });
		}
		if (![1, 2, 3, 4, 5].includes(star)) {
			return res.status(400).json({
				message: "star must be a number from 1 to 5",
			});
		}
		const review = await Review.create({
			owner: req.user?._id,
			sauceId: sauceId,
			star: star,
			text: text,
		});

		const populatedReview = await Review.findById(review._id)
			.populate("owner", "name email")
			.populate("sauceId", "name title description ingredients image");

		return res
			.status(200)
			.json({
				message: "Review Created Successfully",
				review: populatedReview,
			});
	} catch (error) {
		return res.status(400).json({
			message: "Something went wrong while creating a review",
		});
	}
};

// read reviews of the user
const getUserReviews = async (req, res) => {
	try {
		const user = req.user;
		const reviews = await Review.find({ owner: user._id })
			.populate("owner", "name email")
			.populate("sauceId", "name title description ingredients image");
		return res
			.status(200)
			.json({ message: "User Reviews fetched Successfully", reviews });
	} catch (error) {
		return res.status(400).json({
			message: "Something went wrong while getting user reviews",
		});
	}
};

// update review
const updateReview = async (req, res) => {
	try {
		const { reviewId, star, text } = req.body;
		if (![1, 2, 3, 4, 5].includes(star)) {
			return res.status(400).json({
				message: "star must be a number from 1 to 5",
			});
		}
		const review = await Review.findOneAndUpdate(
			{ _id: reviewId, owner: req.user._id },
			{ star, text },
			{ new: true }
		)
			.populate("owner", "name email")
			.populate("sauceId", "name title description ingredients image");

		if (!review) {
			return res.status(404).json({ message: "incorrect reviewId Review not found" });
		}
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
		const { reviewId } = req.body;
		const review = await Review.findOneAndDelete({
			_id: reviewId,
			owner: req.user._id,
		})
			.populate("owner", "name email")
			.populate("sauceId", "name title description ingredients image");

		if (!review) {
			return res.status(404).json({ message: "Review not found" });
		}
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
