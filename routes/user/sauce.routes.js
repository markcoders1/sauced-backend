const express = require("express");
const {
	requestSauce,
	likeSauce,
	viewSauce,
	getSauces,
	changeSauceImage,
	
} = require("../../controllers/user/sauce.controller");
const authMiddleware = require("../../middlewares/auth.middleware.js");
const { upload } = require("../../middlewares/multer.middleware.js");

const router = express.Router();

router.post("/request-sauce", authMiddleware, requestSauce);
router.post("/like-sauce", authMiddleware, likeSauce);
router.post("/view-sauce", authMiddleware, viewSauce);
router.get("/get-sauces", authMiddleware, getSauces);
router.post("/change-sauce-image", authMiddleware, upload.single("image"), changeSauceImage)

module.exports = router;
