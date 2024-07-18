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
		const existingFollow = await Follow.findOne({
			followGiver: followGiver,
			followReciever: followReciever,
		});

		if (existingFollow) {
			return res
				.status(400)
				.json({ message: "User is already followed" });
		}
		const follow = await Follow.create({
			followGiver: followGiver,
			followReciever: followReciever,
		});
		await follow.save();
		//! missing populate 
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
		const userToUnfollow = req.body?._id;
		if (!mongoose.isValidObjectId(userToUnfollow)) {
			return res
				.status(400)
				.json({ message: "Invalid user id to unfollow" });
		}
		const unfollow = await Follow.findOneAndDelete({
			followGiver: userId,
			followReciever: userToUnfollow,
		});
		//! missing populate 
		if (!unfollow) {
			return res
				.status(400)
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
			return res
				.status(400)
				.json({ message: "Invalid user id to block" });
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
		await block.save();
		//populate the details of blocked user
		const blockData = await Block.findOne({
			userId: req.user._id,
		}).populate("blockList");
		// make user unfollow userToBlock
		const unfollowHim = await Follow.findOneAndDelete({
			followGiver: req.user._id,
			followReciever: userToBlock,
		});
		if (unfollowHim) {
			console.log("Blocked User has been unfollowed");
		}
		//make userToBlock unfollow user
		const makeHimUnfollowUs = await Follow.findOneAndDelete({
			followGiver: userToBlock,
			followReciever: req.user._id,
		});
		if (makeHimUnfollowUs) {
			console.log("Blocked User auto unfollowed user ");
		}
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

const unblockUser = async (req, res) => {
	try {
		const userToUnblock = req.body?._id;
		if (!mongoose.isValidObjectId(userToUnblock)) {
			return res
				.status(400)
				.json({ message: "Invalid user id to unblock" });
		}
		// Check if a block document for the current user exists
		let block = await Block.findOne({ userId: req.user._id });
		if (!block || !block.blockList.includes(userToUnblock)) {
			return res.status(400).json({ message: "User is not blocked" });
		}
		// Remove the user from the blockList
		block.blockList = block.blockList.filter(
			(id) => id.toString() !== userToUnblock.toString()
		);
		await block.save();
		// Populate the details of the block document
		const blockData = await Block.findOne({
			userId: req.user._id,
		}).populate("blockList");

		// Optional: Re-establish follow relationships if needed
		// Uncomment the following lines if you want to re-establish follow relationships
		// after unblocking (this is usually not required, but added here for completeness)

		// const reFollowHim = new Follow({
		// 	followGiver: req.user._id,
		// 	followReciever: userToUnblock,
		// });
		// await reFollowHim.save();

		// const reFollowUs = new Follow({
		// 	followGiver: userToUnblock,
		// 	followReciever: req.user._id,
		// });
		// await reFollowUs.save();

		return res.status(200).json({
			message: "User has been unblocked successfully",
			blockData,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: "Something went wrong while unblocking a user",
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
	unblockUser,
};
