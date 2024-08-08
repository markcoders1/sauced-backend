const User = require("../../models/user.model.js");
const { Follow } = require("../../models/follow.model.js");
const { Checkin } = require("../../models/checkin.model.js");
const { initializeAdmin } = require("../../services/firebase.js");
const admin = initializeAdmin();

// const deactivateUser = async (req, res) => {
// 	try {
// 		const { email } = req.body;
// 		if (!email)
// 			return res.status(400).send({ message: "User email is required." });

// 		const user = await User.findOne({ email: req.body.email });
// 		if (!user) return res.status(404).send({ message: "User not found," });

// 		// Deactivate the user in Firebase
// 		const disabled = await admin
// 			.auth()
// 			.updateUser(user.uid, { disabled: true });

// 		// Update the user's status to inactive in MongoDB
// 		user.status = "inactive";
// 		await user.save();

// 		res.status(200).send({ message: "User has been deleted.", disabled });
// 	} catch (error) {
// 		console.log(error);
// 		return res.status(400).json({
// 			message: "Something went wrong while deleting user",
// 			error,
// 		});
// 	}
// };

// const reactivateUser = async (req, res) => {
// 	try {
// 		const user = await User.findOne({ email: req.body.email });
// 		if (!user) return res.status(404).send({ message: "User not found," });
// 		const activate = await admin
// 			.auth()
// 			.updateUser(user.uid, { disabled: false });
// 		user.status = "active";
// 		await user.save();
// 		res.status(200).send({ message: "User has been undeleted.", activate });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(500).json({
// 			message: "Something went wrong while undeleting user",
// 			error,
// 		});
// 	}
// };
const blockUnblockUser = async (req, res) => {
	// Basically toggle between deactivate user and reactivate user
	try {
		const { userId } = req.body;
		if (!userId)
			return res.status(400).send({ message: "userId is required." });

		const user = await User.findById(userId);
		if (!user) return res.status(404).send({ message: "User not found." });

		const newStatus = user.status === "active" ? "inactive" : "active";
		const disabled = newStatus === "inactive";

		// Update the user's status in Firebase
		const updatedUser = await admin
			.auth()
			.updateUser(user.uid, { disabled });

		// Update the user's status in MongoDB
		user.status = newStatus;
		await user.save();

		const action = disabled ? "deactivated" : "reactivated";
		res.status(200).send({
			message: `User has been ${action}.`,
			user: updatedUser,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Something went wrong while toggling user status",
			error,
		});
	}
};

const editUser = async (req, res) => {
	try {
		const {
			email,
			name,
			type,
			status,
			image,
			bannerImage,
			provider,
			points,
		} = req.body;

		if (!email) {
			return res.status(400).json({ message: "User email is required" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		user.name = name || user.name;
		user.type = type || user.type;
		user.status = status || user.status;
		user.image = image || user.image;
		user.bannerImage = bannerImage || user.bannerImage;
		user.provider = provider || user.provider;
		user.points = points || user.points;

		const updatedUser = await user.save();

		return res.status(200).json({
			message: "User updated successfully",
			user: updatedUser,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Something went wrong while updating user",
			error,
		});
	}
};

const getAllUsers = async (req, res) => {
	try {
		const { type } = req.query;

		let query = {};
		if (type) {
			query.type = type; // Filter by user type if provided
		}

		// Fetch users based on query
		const users = await User.find(query);

		// Use Promise.all to fetch following, follower counts, and check-in counts for each user in parallel
		const usersWithCounts = await Promise.all(
			users.map(async (user) => {
				const followingCount = await Follow.countDocuments({
					followGiver: user._id,
				});
				const followersCount = await Follow.countDocuments({
					followReceiver: user._id,
				});
				const checkinCount = await Checkin.countDocuments({
					owner: user._id,
				});
				return {
					...user._doc,
					following: followingCount,
					followers: followersCount,
					checkins: checkinCount,
				};
			})
		);

		return res.status(200).send({
			users: usersWithCounts,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Something went wrong while getting users",
			error,
		});
	}
};

module.exports = {
	// reactivateUser,
	getAllUsers,
	// deactivateUser,
	blockUnblockUser,
	editUser,
};
