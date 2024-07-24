const express = require("express");
const {
	requestSauce,
	addSauce,
	likeSauce,
	viewSauce,
	getSauces,
	
} = require("../../controllers/user/sauce.controller");
const authMiddleware = require("../../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/request-sauce", authMiddleware, requestSauce);
router.post("/add-sauce", authMiddleware, addSauce);
router.post("/like-sauce", authMiddleware, likeSauce);
router.post("/view-sauce", authMiddleware, viewSauce);
router.post("/get-sauces", authMiddleware, getSauces)

module.exports = router;
