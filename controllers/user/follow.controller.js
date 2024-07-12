const User = require("../../models/user.model.js");
const Follow = require("../../models/follow.model.js");
const mongoose = require("mongoose");

const follow = async (req, res) => {
	try {
		// follow another user

		const followGiver = req.user._id;
		const followReciever = req.body._id;
		if (!mongoose.isValidObjectId(followReciever)) {
			return res.status(400).json({ message: "Invalid follower id" });
		}
		const follow = await Follow.create({
			followGiver: followGiver,
			followReciever: followReciever,
		});
		await follow.save();
		return res
			.status(200)
			.json({ message: "user has been followed Successfully", follow });
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ message: "Something went wrong while following", error });
	}
};
const getFollowers = async (req, res) => {
	try {
		// return list of users that follow current user, with their details

		const followers = await Follow.aggregate([
			{
				//grab all those documents where current user is recieving a follow
				$match: {
					followReciever: req.user._id,
				},
			},
			{
				//search followGiver _id in users db
				$lookup: {
					from: "users",
					localField: "followGiver",
					foreignField: "_id",
					as: "followGiverDetails",
				},
			},
			{
				//format to only get first item of followGiverDetails array
				$addFields: {
					followGiverDetails: {
						$first: "$followGiverDetails",
					},
				},
			},
		]);
		// console.log(followers);
		return res
			.status(200)
			.json({ message: "followers fetched Successfully", followers });
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: "Something went wrong while getting followers",
			error,
		});
	}
};
const getFollowing = async (req, res) => {
	try {
		// get list of users that current user is following, with their details

		const following = await Follow.aggregate([
			{
				$match: {
					followGiver: req.user._id,
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "followReciever",
					foreignField: "_id",
					as: "followRecieverDetails",
				},
			},
			{
				$addFields: {
					followRecieverDetails: {
						$first: "$followRecieverDetails",
					},
				},
			},
		]);
		// console.log(following);
		return res.status(200).json({
			message: "users following fetched Successfully",
			following,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: "Something went wrong while getting following",
			error,
		});
	}
};

module.exports = {
	follow,
	getFollowers,
	getFollowing,
};
