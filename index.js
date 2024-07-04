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

//routes
//User Routes
const profileRouter = require("./routes/user/profile.routes.js");
const authRouter = require("./routes/user/auth.routes.js");

//Admin Routes
const adminAuthRouter = require("./routes/admin/auth.routes.js");

//routes usage
//admin
app.use("/api/auth", adminAuthRouter);

//user
app.use("/api", profileRouter);
app.use("/api/auth", authRouter);

app.use("*", (req, res) =>
    res.status(404).json({ error: "route not found", code: 404 })
);

//server connection
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
