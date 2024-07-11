const User = require("../../models/user.model.js");
const { initializeAdmin } = require("../../services/firebase.js");
const admin = initializeAdmin();
const jwt = require("jsonwebtoken");

//Firebase authentication
const firebaseAuth = async (req, res) => {
    try {
        if (!req.body.accessToken)
            return res
                .status(400)
                .send({ message: "Access token is required" });
        const idToken = req.body.accessToken;
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        console.log("Decoded Token : ",decodedToken);
        const uid = decodedToken.uid;
        console.log("User authenticated with Firebase UID:", uid);
        console.log("AUTH_TOKEN", req.body.accessToken);
        let userData = await admin.auth().getUser(uid);
        userData = JSON.parse(JSON.stringify(userData));
        console.log(userData);
        let user = await User.findOne({
            email: userData.email || userData.providerData[0].email,
        });
        if (!user) {
            console.log({ body: req.body });
            user = new User({
                uid: userData.uid,
                email: userData.email || userData.providerData[0].email,
                name: req.body?.name ?? userData.displayName,
                provider:
                    req.body?.provider ?? userData.providerData[0].providerId,
                status: "active",
                welcome:true
            });
            console.log(user._doc);
            const newUser = await user.save();
            const token = jwt.sign(
                { _id: newUser._id },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "60d",
                }
            );
            res.status(201).send({ user: { token, ...newUser._doc } });
        } else {
            const token = jwt.sign({ _id: user._id }, process.env.TOKEN_KEY, {
                expiresIn: "60d",
            });
            res.status(200).send({
                user: {
                    token,
                    // provider,
                    ...user._doc,
                },
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
};

module.exports = {
    firebaseAuth,
};
