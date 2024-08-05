const express = require("express");
const {
	getCheckins,
} = require("../../controllers/admin/checkin.controller.js");

const adminRouter = express.Router();

adminRouter.get("/get-all-checkins", getCheckins);

module.exports = adminRouter;
