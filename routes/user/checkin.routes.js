const express = require("express");
const {
	checkinSauce,
} = require("../../controllers/user/checkin.controller.js");
const authMiddleware = require("../../middlewares/auth.middleware.js");
const { upload } = require("../../middlewares/multer.middleware.js");

const router = express.Router();

router.post("/checkin", authMiddleware, upload.array("images"), checkinSauce);

module.exports = router;
