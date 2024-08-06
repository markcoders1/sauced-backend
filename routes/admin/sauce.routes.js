const express = require("express");
const adminMiddleware = require("../../middlewares/admin.middleware.js");
const { upload } = require("../../middlewares/multer.middleware.js");
const {
	addSauce,
	toggleSauceFeaturedStatus,
	editSauce,
} = require("../../controllers/admin/sauce.controller.js");

const adminRouter = express.Router();
adminRouter.use(adminMiddleware); // Apply admin middleware to all adminRouter (in every file wherever adminRouter is used)

adminRouter.post(
	"/add-sauce",
	upload.fields([
		{ name: "image", maxCount: 1 },
		{ name: "bannerImage", maxCount: 1 },
	]),
	addSauce
);
adminRouter.post("/toggle-feature-sauce", toggleSauceFeaturedStatus);
adminRouter.post(
	"/edit-sauce",
	upload.fields([
		{ name: "image", maxCount: 1 },
		{ name: "bannerImage", maxCount: 1 },
	]),
	editSauce
);

module.exports = adminRouter;
