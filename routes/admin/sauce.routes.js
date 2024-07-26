const express = require("express");
const adminMiddleware = require("../../middlewares/admin.middleware.js");
const { upload } = require("../../middlewares/multer.middleware.js");
const {
	addSauce,
	changeAnySauceImage,
} = require("../../controllers/admin/sauce.controller.js");

const adminRoutes = express.Router();
adminRoutes.use(adminMiddleware); // Apply admin middleware to all adminRoutes (in every file wherever adminRoutes is used)

adminRoutes.post("/add-sauce", upload.single("image"), addSauce);
adminRoutes.post("/change-sauce-image", upload.single("image"), changeAnySauceImage);

module.exports = adminRoutes;
