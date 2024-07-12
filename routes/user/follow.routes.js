const express = require('express');
const {	
	follow,
	getFollowers,
	getFollowing,
	blockUser,
} = require("../../controllers/user/follow.controller.js")
const authMiddleware = require("../../middlewares/auth.middleware.js");
const router = express.Router();


router.post("/follow" , authMiddleware, follow)
router.get("/get-followers" , authMiddleware, getFollowers)
router.get("/get-following" , authMiddleware, getFollowing)
router.post("/block", authMiddleware, blockUser)


module.exports = router;
