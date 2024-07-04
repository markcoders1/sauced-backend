const express = require('express');
const { changeName } = require('../../controllers/user/profile.controller.js');
const authMiddleware = require('../../middlewares/auth.middleware.js');
const { firebaseAuth }= require('../../controllers/user/firebase.controller.js');

const router = express.Router();



router.patch("/change-name",authMiddleware ,changeName)
// router.post("/change-password",authMiddleware, changePassword)

router.post("/firebase", firebaseAuth )

module.exports = router;


