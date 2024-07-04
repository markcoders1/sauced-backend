const express = require('express');
const { firebaseAuth }= require('../../controllers/user/auth.controller.js');

const router = express.Router();

router.post("/firebase-authentication", firebaseAuth)

module.exports = router;


