const express = require("express");
const {
	reactivateUser,
} = require("../../controllers/admin/profile.controller.js");
const adminRoutes = express.Router();
//admin middleware already applied on adminRoutes

adminRoutes.post("/reactivate-user", reactivateUser);

module.exports = adminRoutes;
