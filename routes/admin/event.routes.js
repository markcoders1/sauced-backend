const express = require("express");
const { addEvent } = require("../../controllers/admin/event.controller.js");

// const adminMiddleware = require("../../middlewares/admin.middleware.js");

const adminRouter = express.Router();
// adminRouter.use(adminMiddleware);

adminRouter.post("/add-event", addEvent);

module.exports = adminRouter;
