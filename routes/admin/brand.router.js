const express = require("express");
const {
	createBrand,
	changeUserToBrand,
	getBrandSauces,
	demoteBrandToUser,
} = require("../../controllers/admin/brand.controller.js");

const { upload } = require("../../middlewares/multer.middleware.js");

const adminRouter = express.Router();

adminRouter.post("/create-brand", upload.single("image"), createBrand);
adminRouter.post("/change-user-to-brand", changeUserToBrand);
adminRouter.get("/brand-sauces/:brandId", getBrandSauces); // Route for fetching a brand's sauces
adminRouter.post("/demote-brand-to-user", demoteBrandToUser); // Route for demoting a brand to a user

module.exports = adminRouter;
