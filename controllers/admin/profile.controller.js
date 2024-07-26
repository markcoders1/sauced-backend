
const User = require("../../models/user.model.js");

const reactivateUser = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) return res.status(404).send({ message: "User not found," });
		const activate = await admin
			.auth()
			.updateUser(user.uid, { disabled: false });
		user.status = "active";
		await user.save();
		res.status(200).send({ message: "User has been undeleted.", activate });
	} catch (error) {
		res.status(500).json({
			message: "Something went wrong while undeleting user",
			error,
		});
	}
};

module.exports={
    reactivateUser,
}