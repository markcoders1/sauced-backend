const express = require("express");
const {
	createReview,
	getUserReviews,
	updateReview,
	deleteReview,
} = require("../../controllers/user/review.controller.js");
const authMiddleware = require("../../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/create-review", authMiddleware, createReview);
router.get("/get-user-reviews", authMiddleware, getUserReviews);
router.post("/delete-review", authMiddleware, deleteReview);
router.post("/update-review", authMiddleware, updateReview);

module.exports = router;
