const express = require('express');
const { firebaseAuth, webhook }= require('../../controllers/user/auth.controller.js');

const router = express.Router();

router.post("/firebase-authentication", firebaseAuth)
router.post("/webhook",webhook)

module.exports = router;


