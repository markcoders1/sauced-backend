const User = require("../../models/user.model.js");
const { Follow, Block } = require("../../models/follow.model.js");
const mongoose = require("mongoose");

const follow = async (req, res) => {
	try {
		// follow another user

		const followGiver = req.user._id;
		const followReciever = req.body._id;
		if (!mongoose.isValidObjectId(followReciever)) {
			return res
				.status(400)
				.json({ message: "Invalid user id to follow" });
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

const unfollow = async (req, res) => {
	try {
		// check if id is valid of userToUnfollow
		// check if user is already unfollowed
		// grab the follow document and delete that
		const userId = req.user._id;
		const userToUnfollow = req.body._id;
		if (!mongoose.isValidObjectId(userToUnfollow)) {
			return res
				.status(400)
				.json({ message: "Invalid user id to unfollow" });
		}
		const unfollow = await Follow.findOneAndDelete({
			followGiver: userId,
			followReciever: userToUnfollow,
		});
		if (!unfollow) {
			return res
				.status(200)
				.json({ message: "user is already unfollowed " });
		} else {
			return res
				.status(200)
				.json({ message: "user unfollowed Successfully", unfollow });
		}
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ message: "something went wrong while unfollowing user" });
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

const blockUser = async (req, res) => {
	try {
		const userToBlock = req.body?._id;
		if (!mongoose.isValidObjectId(userToBlock)) {
			return res.status(400).json({ message: "Invalid user id" });
		}
		// Check if a block document for the current user exists
		let block = await Block.findOne({ userId: req.user._id });
		if (!block) {
			// If no block document exists, create a new one
			block = new Block({
				userId: req.user._id,
				blockList: [userToBlock],
			});
		} else {
			//If a block document exists, only add userToBlock if it's not already in the blockList
			if (!block.blockList.includes(userToBlock)) {
				block.blockList.push(userToBlock);
			} else {
				return res
					.status(400)
					.json({ message: "User is already blocked" });
			}
		}
		//populate the details of blocked user
		await block.save();
		const blockData = await Block.findOne({
			userId: req.user._id,
		}).populate("blockList");
		//!missing make user unfollow userToBlock
		//!missing make userToBlock unfollow user
		//! finish after unfollowing is done
		return res
			.status(200)
			.json({ message: "user has been blocked Successfully", blockData });
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: "Something went wrong while blocking a user",
			error,
		});
	}
};

module.exports = {
	follow,
	getFollowers,
	getFollowing,
	blockUser,
	unfollow,
};
