const express = require("express");
const {
	requestSauce,
	addSauce,
	likeSauce,
} = require("../../controllers/user/sauce.controller");
const authMiddleware = require("../../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/request-sauce", authMiddleware, requestSauce);
router.post("/add-sauce", authMiddleware, addSauce);
router.post("/like-sauce", authMiddleware, likeSauce);

module.exports = router;
