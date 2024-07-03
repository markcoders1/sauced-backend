const { sign } = require("jsonwebtoken");
const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

//signup
const signup = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user)
            return res.status(400).send({ message: "User already exists" });
        if (!req.body.email || !req.body.password || !req.body.fullName)
            return res.status(400).send({ message: "Missing parameters" });
        const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT));
        const hashPassword = await bcrypt.hash(
            req.body.password.toString(),
            salt
        );
        const newUser = new User({
            email: req.body.email,
            name: req.body.fullName,
            password: hashPassword,
        });
        await newUser.save();
        res.status(201).send({ message: "User created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong:(" });
    }
};

//Login
const login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ email: email });
        if (!user)
            return res
                .status(422)
                .send({ message: "Email or password is incorrect." });
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword)
            return res
                .status(422)
                .send({ message: "Email or password is incorrect." });
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_KEY, {
            expiresIn: "60d",
        });
        res.status(200).send({
            user: {
                message: "Logged in!",
                email: user.email,
                name: user.name,
                token: token,
                type: user.type,
            },
        });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

const transporter = nodemailer.createTransport({
    service: "Gmail",
  
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASS,
    },
  }
);
  

const forgetPassword = async (req,res) => {
    try {
        
        const {email} = req.query
        console.log(`Trying to send email to ${email}`);
        const theEmail  = {
            from : process.env.APP_EMAIL,
            to:  email,
            subject:  "reset password",
            text: "You tried to reset your password \n Please click the link below \n "
          }
        await transporter.sendMail(theEmail, (error) => {
		if (error) return res.status(400).json({ "Email not sent": error });
    });
        return res.status(200).json({message:"Email sent Successfully"})
    } catch (error) {
        return res.status(400).json({message: "Something went wrong in forget password", error})
    }
}



module.exports = {
    login,
    signup,
    forgetPassword
};
