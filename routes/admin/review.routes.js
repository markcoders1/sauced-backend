const express = require("express");
const { deleteSpecificReview } = require("../../controllers/admin/review.controller.js")
const adminRoutes = express.Router();
//admin middleware already applied on adminRoutes

adminRoutes.post("/delete-specific-review" , deleteSpecificReview);

module.exports = adminRoutes;
