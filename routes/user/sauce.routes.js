const express = require("express");
const {
	requestSauce,
	addSauce,
	likeSauce,
	viewSauce,
	getSauces,
	changeSauceImage,
	
} = require("../../controllers/user/sauce.controller");
const authMiddleware = require("../../middlewares/auth.middleware.js");
const { upload } = require("../../middlewares/multer.middleware.js");

const router = express.Router();

router.post("/request-sauce", authMiddleware, requestSauce);
router.post("/add-sauce", authMiddleware,  upload.single("image"), addSauce);
router.post("/like-sauce", authMiddleware, likeSauce);
router.post("/view-sauce", authMiddleware, viewSauce);
router.post("/get-sauces", authMiddleware, getSauces);
router.post("/change-sauce-image", authMiddleware, upload.single("image"), changeSauceImage)

module.exports = router;
