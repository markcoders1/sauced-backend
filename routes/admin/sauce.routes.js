const express = require("express");
const adminMiddleware = require("../../middlewares/admin.middleware.js");
const { upload } = require("../../middlewares/multer.middleware.js");
const {
	addSauce,
	changeAnySauceImage,
	toggleSauceFeaturedStatus,
	editSauce,
} = require("../../controllers/admin/sauce.controller.js");

const adminRouter = express.Router();
adminRouter.use(adminMiddleware); // Apply admin middleware to all adminRouter (in every file wherever adminRouter is used)

adminRouter.post("/add-sauce", upload.single("image"), addSauce);
adminRouter.post(
	"/change-sauce-image",
	upload.single("image"),
	changeAnySauceImage
);
adminRouter.post("/toggle-feature-sauce", toggleSauceFeaturedStatus);
adminRouter.post("/edit-sauce", upload.single("image"), editSauce);

module.exports = adminRouter;
