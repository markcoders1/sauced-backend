const express = require("express");
const {
	changeName,
	changeImage,
	deleteUser,
	addSauce,
	welcome1,
	welcome2,
	reactivateUser,
	getUser,
	getRandomUsers,
} = require("../../controllers/user/profile.controller.js");
const authMiddleware = require("../../middlewares/auth.middleware.js");
const { upload } = require("../../middlewares/multer.middleware.js");

const router = express.Router();
// router.use(authMiddleware); // Apply auth middleware to all routes in this file

router.patch("/change-name", authMiddleware, changeName);
router.post("/change-image",authMiddleware, upload.single("image"), changeImage);
router.post("/delete-user", authMiddleware, deleteUser);
router.post("/test", reactivateUser) 
router.post("/add-sauce", authMiddleware, addSauce);
router.get("/welcome", authMiddleware ,welcome1)
router.post("/welcome", authMiddleware, welcome2)
router.get("/get-user", authMiddleware, getUser )
router.get("/get-random-users" ,authMiddleware , getRandomUsers )



module.exports = router;
