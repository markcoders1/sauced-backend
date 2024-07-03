const express = require('express');
const { changeName } = require('../../controllers/user/profile.controller.js');
const authMiddleware = require('../../middlewares/auth.middleware.js');

const router = express.Router();



router.patch("/change-name",authMiddleware ,changeName)
// router.post("/change-password", changePassword)

module.exports = router;


