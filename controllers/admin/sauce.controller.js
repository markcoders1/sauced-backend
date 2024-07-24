// Top Rated sauces array

// Featured Sauces array

// Tope Rated Brands Array

// Hot Sauce Map array

// search for specific sauce

// search for specific brand ( return all sauces of a brand )

// makeSauceFeatured API

// get all sauces

// get all reviews

// get all users

// const deleteSpecificReview = async (req, res) => {
// 	try {
// 		const { reviewId } = req.params;
// 		const review = await Review.findOneAndDelete({ _id: reviewId });
// 		if (!review) {
// 			return res.status(404).json({ message: "Review not found" });
// 		}
// 		return res.status(200).json({ message: "Review deleted successfully" });
// 	} catch (error) {
// 		return res
// 			.status(400)
// 			.json({
// 				message: "Something went wrong while deleting the review",
// 			});
// 	}
// };