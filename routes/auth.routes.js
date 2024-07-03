const express = require('express');
const { login, signup, forgetPassword } = require('../controllers/auth.controller.js');

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login",login);
authRouter.post("/forget-password", forgetPassword)


module.exports = authRouter;