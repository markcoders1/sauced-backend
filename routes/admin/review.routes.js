const express = require("express");
const { deleteSpecificReview, getAllReviews } = require("../../controllers/admin/review.controller.js")
const adminRouter = express.Router();
//admin middleware already applied on adminRouter

adminRouter.post("/delete-specific-review" , deleteSpecificReview);
adminRouter.get("/get-all-reviews", getAllReviews);

module.exports = adminRouter;
