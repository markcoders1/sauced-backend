const express = require("express");
const {
	reactivateUser,
} = require("../../controllers/admin/profile.controller.js");
const adminRouter = express.Router();
//admin middleware already applied on adminRouter

adminRouter.post("/reactivate-user", reactivateUser);

module.exports = adminRouter;
