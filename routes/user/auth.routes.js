const express = require('express');
const { firebaseAuth, webhook, test1 }= require('../../controllers/user/auth.controller.js');

const router = express.Router();

router.post("/firebase-authentication", firebaseAuth)
router.post("/webhook",webhook)
router.get("/test1", test1)

module.exports = router;


