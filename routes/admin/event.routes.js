const express = require("express");
const {
	addEvent,
	deleteEvent,
	getEvent,
	getAllEvents,
	updateEvent,
} = require("../../controllers/admin/event.controller.js");

const { upload } = require("../../middlewares/multer.middleware.js");

// const adminMiddleware = require("../../middlewares/admin.middleware.js");

const adminRouter = express.Router();
// adminRouter.use(adminMiddleware);

adminRouter.post("/add-event", upload.single("bannerImage"), addEvent);
adminRouter.delete("/delete-event", deleteEvent);
adminRouter.get("/get-event", getEvent);
adminRouter.get("/get-all-events", getAllEvents);
adminRouter.put("/update-event", upload.single("bannerImage"), updateEvent);

module.exports = adminRouter;
