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
	res.send("Hello World!");
});

// very important for file uploads
app.use("/uploads", express.static("uploads"));

//routes
//User Routes
const profileRouter = require("./routes/user/profile.routes.js");
const authRouter = require("./routes/user/auth.routes.js");
const followRoutes = require("./routes/user/follow.routes.js");
const sauceRoutes = require("./routes/user/sauce.routes.js");
const reviewRoutes = require("./routes/user/review.routes.js");

//Admin Routes
const adminAuthRouter = require("./routes/admin/auth.routes.js");
const adminSauceRoutes = require("./routes/admin/sauce.routes.js");
const adminReviewRoutes = require("./routes/admin/review.routes.js");
const adminProfileRoutes = require('./routes/admin/profile.routes.js')

//routes usage
//admin
app.use("/api/auth", adminAuthRouter);
app.use("/api/admin", adminSauceRoutes);
app.use("/api/admin", adminReviewRoutes);
app.use("/api/admin", adminProfileRoutes);

//user
app.use("/api/auth", authRouter);
app.use("/api", profileRouter);
app.use("/api", followRoutes);
app.use("/api", sauceRoutes);
app.use("/api", reviewRoutes);

app.use("*", (req, res) =>
	res.status(404).json({ error: "route not found", code: 404 })
);

//server connection
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
