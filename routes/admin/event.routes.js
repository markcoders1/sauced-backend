const express = require("express");
const {
	addEvent,
	deleteEvent,
	getEvent,
	getAllEvents,
	updateEvent,
} = require("../../controllers/admin/event.controller.js");

// const adminMiddleware = require("../../middlewares/admin.middleware.js");

const adminRouter = express.Router();
// adminRouter.use(adminMiddleware);

adminRouter.post("/add-event", addEvent);
adminRouter.delete("/delete-event", deleteEvent);
adminRouter.get("/get-event", getEvent);
adminRouter.get("/get-all-events", getAllEvents);
adminRouter.put("/update-event", updateEvent);

module.exports = adminRouter;
