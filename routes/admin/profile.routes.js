const express = require("express");
const {
	reactivateUser,
	getAllUsers,
} = require("../../controllers/admin/profile.controller.js");
const adminRouter = express.Router();
//admin middleware already applied on adminRouter

adminRouter.post("/reactivate-user", reactivateUser);
adminRouter.get("/get-all-users", getAllUsers);


module.exports = adminRouter;
