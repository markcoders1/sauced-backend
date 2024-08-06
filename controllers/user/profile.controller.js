// const { STATUS_CODES } = require("http");
const { Sauce } = require("../../models/sauce.model.js");
const User = require("../../models/user.model.js");
const { Follow, Block } = require("../../models/follow.model.js");
const baseUrl = process.env.SERVER_BASE_URL || "/";
const fs = require("fs");
const { initializeAdmin } = require("../../services/firebase.js");
const admin = initializeAdmin();

const changeName = async (req, res) => {
	//update logged in user's name
	try {
		let { newName } = req.body;
		if (!newName) {
			return res
				.status(400)
				.json({ message: "Error: new name cant be empty." });
		}
		if (req.user.name === newName) {
			return res.status(400).json({
				message: "Error: Old name and new name are the same.",
			});
		}
		const user = await User.findByIdAndUpdate(
			req.user?._id,
			{
				$set: {
					name: newName,
				},
			},
			{ new: true }
		);

		return res.status(200).json({
			message: "User Name Changed Successfully",
			user,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: "Something went wrong while changing name",
			error,
		});
	}
};

const changeImage = async (req, res) => {
	// Upload image and bannerImage, and overwrite user's previous images
	try {
		if (!req.files || (!req.files.image && !req.files.bannerImage)) {
			console.log("Image or Banner Image not found");
			return res
				.status(400)
				.json({ message: "Image or Banner Image not found" });
		}

		const user = await User.findOne({ email: req.user.email });

		if (req.files.image) {
			user.image = baseUrl + "uploads/" + req.files.image[0].filename;
		}
		if (req.files.bannerImage) {
			user.bannerImage =
				baseUrl + "uploads/" + req.files.bannerImage[0].filename;
		}

		const updatedUser = await user.save();

		return res.status(200).json({
			message: "Images Updated Successfully",
			updatedUser,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: "Something went wrong while changing images",
			error,
		});
	}
};

const deleteUser = async (req, res) => {
	try {
		//set logged in user's status to inactive and disable them from firebase as well
		const user = await User.findOne({ email: req.user.email });
		if (!user) return res.status(404).send({ message: "User not found." });
		const disabled = await admin
			.auth()
			.updateUser(user.uid, { disabled: true });
		user.status = "inactive";
		await user.save();
		res.status(200).send({ message: "User has been deleted.", disabled });
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: "Something went wrong while Deleting user",
			error,
		});
	}
};

const getUser = async (req, res) => {
	try {
		//return current user and his followers count and following count
		const user = await User.findOne({ email: req.user.email });
		console.log(user);
		const following = await Follow.countDocuments({
			followGiver: user._id,
		});
		const followers = await Follow.countDocuments({
			followReciever: user._id,
		});
		return res.status(200).send({
			user: {
				// provider,
				...user._doc,
				following,
				followers,
				//! and include user's checkin count as well
			},
		});
	} catch (error) {
		res.status(500).json({
			message: "Something went wrong while getting user details",
			error,
		});
	}
};

const welcome1 = async (req, res) => {
	try {
		// return user's welcome boolean
		const welcome = req.user.welcome;
		return res.status(200).json({ welcome });
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: "Something went wrong while showing welcome message",
			error,
		});
	}
};

const welcome2 = async (req, res) => {
	try {
		// update user's welcome boolean to false
		const user = await User.findByIdAndUpdate(
			req.user?._id,
			{
				$set: {
					welcome: false,
				},
			},
			{ new: true }
		);
		user.save();
		const welcome = user.welcome;
		return res.status(200).json({ welcome });
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: "Something went wrong while updating welcome boolean",
			error,
		});
	}
};

const getRandomUsers = async (req, res) => {
	try {
		//returns 10 random users from db
		const randomUsers = await User.aggregate([
			{
				$sample: { size: 10 },
			},
		]);
		// console.log(randomUsers);
		return res.status(200).json({
			message: "Random Users Fetched Successfully",
			randomUsers,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: "Something went wrong while getting random users",
			error,
		});
	}
};

module.exports = {
	changeName,
	changeImage,
	deleteUser,
	welcome1,
	welcome2,
	getUser,
	getRandomUsers,
};
