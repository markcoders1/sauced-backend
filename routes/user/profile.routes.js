const express = require("express");
const { changeName, changeImage } = require("../../controllers/user/profile.controller.js");
const authMiddleware = require("../../middlewares/auth.middleware.js");
const {upload }= require("../../middlewares/multer.middleware.js")

const router = express.Router();

router.patch("/change-name", authMiddleware, changeName);
router.post("/change-image", authMiddleware, upload.single('image'), changeImage);

module.exports = router;
