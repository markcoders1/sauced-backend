const User = require("../../models/user.model.js");
const { Follow } = require("../../models/follow.model.js");
const { initializeAdmin } = require("../../services/firebase.js");
const admin = initializeAdmin();

const deactivateUser = async (req, res) => {
	try {
		const { email } = req.body;
		if (!email)
			return res.status(400).send({ message: "User email is required." });

		const user = await User.findOne({ email: req.body.email });
		if (!user) return res.status(404).send({ message: "User not found," });

		// Deactivate the user in Firebase
		const disabled = await admin
			.auth()
			.updateUser(user.uid, { disabled: true });

		// Update the user's status to inactive in MongoDB
		user.status = "inactive";
		await user.save();

		res.status(200).send({ message: "User has been deleted.", disabled });
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: "Something went wrong while deleting user",
			error,
		});
	}
};

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
		console.log(error);
		res.status(500).json({
			message: "Something went wrong while undeleting user",
			error,
		});
	}
};

// get all users, along with following and follower count
const getAllUsers = async (req, res) => {
	try {
		// Fetch all users
		const users = await User.find({});

		// Use Promise.all to fetch following and follower counts for each user in parallel
		const usersWithFollowCounts = await Promise.all(
			users.map(async (user) => {
				const followingCount = await Follow.countDocuments({
					followGiver: user._id,
				});
				const followersCount = await Follow.countDocuments({
					followReciever: user._id,
				});
				return {
					...user._doc,
					following: followingCount,
					followers: followersCount,
				};
			})
		);

		return res.status(200).send({
			users: usersWithFollowCounts,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Something went wrong while getting all users",
			error,
		});
	}
};

module.exports = {
	reactivateUser,
	getAllUsers,
	deactivateUser,
};
