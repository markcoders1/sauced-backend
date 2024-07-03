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
const authRouter = require("./routes/admin/auth.routes.js");
const router = require("./routes/user/profile.routes.js");

//routes usage
app.use("/api/auth", authRouter);
app.use("/api", router )

app.use("*",(req,res)=>res.status(404).json({error:"route not found",code:404}))

//server connection
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
