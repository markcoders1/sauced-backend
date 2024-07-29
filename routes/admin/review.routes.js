const express = require("express");
const { deleteSpecificReview } = require("../../controllers/admin/review.controller.js")
const adminRouter = express.Router();
//admin middleware already applied on adminRouter

adminRouter.post("/delete-specific-review" , deleteSpecificReview);

module.exports = adminRouter;
