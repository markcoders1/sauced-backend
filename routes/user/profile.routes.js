const express = require("express");
const {
	changeName,
	changeImage,
	deleteUser,
	addSauce,
} = require("../../controllers/user/profile.controller.js");
const authMiddleware = require("../../middlewares/auth.middleware.js");
const { upload } = require("../../middlewares/multer.middleware.js");

const router = express.Router();
// router.use(authMiddleware); // Apply auth middleware to all routes in this file

router.patch("/change-name", authMiddleware, changeName);
router.post("/change-image",authMiddleware, upload.single("image"), changeImage);
router.patch("/delete-user", authMiddleware, deleteUser);
router.post("/add-sauce", authMiddleware, addSauce);

module.exports = router;
