const { Review } = require("../../models/review.model.js");
const mongoose = require("mongoose");

const deleteSpecificReview = async (req, res) => {
	try {
		const { reviewId } = req.body;
		if (!mongoose.isValidObjectId(reviewId)) {
			return res.status(400).json({ message: "Invalid review id" });
		}
		const review = await Review.findOneAndDelete({ _id: reviewId });
		if (!review) {
			return res.status(404).json({ message: "Review not found" });
		}
		return res.status(200).json({ message: "Review deleted successfully" });
	} catch (error) {
		return res.status(400).json({
			message: "Something went wrong while deleting the review",
		});
	}
};

// get all reviews
const getAllReviews = async (req, res) => {
	try {
		const reviews = await Review.find().populate("owner sauceId");
		return res.status(200).json({ reviews });
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ message: "Something went wrong while fetching reviews." });
	}
};

module.exports = {
	deleteSpecificReview,
	getAllReviews,
};
