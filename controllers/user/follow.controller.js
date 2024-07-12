const User = require("../../models/user.model.js");
const Follow = require("../../models/follow.model.js");

const follow = async (req, res) => {
	try {
		// follow another user

		const followGiver = req.user._id;
		const followReciever = req.body._id;

		if (!followGiver || !followReciever) {
			return res
				.status(400)
				.json({ message: "need id to follow that user" });
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
		// return list of users that follow current user
		const result = await Follow.find({
			followReciever: req.user._id, // basically how many times has this user recieved a follow
		});
		const count = result.length;
		return res
			.status(200)
			.json({ message: "followers fetched Successfully", count, result });
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({
				message: "Something went wrong while getting followers",
				error,
			});
	}
};
const getFollowing = async (req, res) => {
	try {
		// get list of users that current user is following
		const result = await Follow.find({
			followGiver: req.user._id, // basically how many times has this user Given a follow
		});
		const count = result.length;
		return res
			.status(200)
			.json({
				message: "users following fetched Successfully",
				count,
				result,
			});
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({
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
