require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

//uncomment the following line to connect to the database, make sure to have the .env file with the correct values
const { connect } = require("./config/Database");
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.send(
		"You are a saucy boy - William Shakespeare (Romeo and Juliet, 1597)"
	);
});

// very important for file uploads
app.use("/uploads", express.static("uploads"));

//routes
//User Routes
const profileRouter = require("./routes/user/profile.routes.js");
const authRouter = require("./routes/user/auth.routes.js");
const followRouter = require("./routes/user/follow.routes.js");
const sauceRouter = require("./routes/user/sauce.routes.js");
const reviewRouter = require("./routes/user/review.routes.js");
const commentRouter = require("./routes/user/comment.routes.js");
const checkinRouter = require("./routes/user/checkin.routes.js");

//Admin Routes
const adminAuthRouter = require("./routes/admin/auth.routes.js");
const adminSauceRouter = require("./routes/admin/sauce.routes.js");
const adminReviewRouter = require("./routes/admin/review.routes.js");
const adminProfileRouter = require("./routes/admin/profile.routes.js");
const adminEventRouter = require("./routes/admin/event.routes.js");
const adminCheckinRouter = require("./routes/admin/checkin.routes.js");
const adminBrandRouter = require("./routes/admin/brand.router.js");

//routes usage
//admin
app.use("/api/auth", adminAuthRouter);
app.use("/api/admin", adminSauceRouter);
app.use("/api/admin", adminReviewRouter);
app.use("/api/admin", adminProfileRouter);
app.use("/api/admin", adminEventRouter);
app.use("/api/admin", adminCheckinRouter);
app.use("/api/admin", adminBrandRouter);

//user
app.use("/api/auth", authRouter);
app.use("/api", profileRouter);
app.use("/api", followRouter);
app.use("/api", sauceRouter);
app.use("/api", reviewRouter);
app.use("/api", commentRouter);
app.use("/api", checkinRouter);

app.use("*", (req, res) =>
	res.status(404).json({ error: "route not found", code: 404 })
);

//server connection
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
