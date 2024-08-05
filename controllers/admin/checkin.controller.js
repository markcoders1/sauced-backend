const { Checkin } = require("../../models/checkin.model.js");
// const { Sauce } = require("../../models/sauce.model.js");
// const User = require("../../models/user.model.js");

const getCheckins = async (req, res) => {
	try {
		const checkins = await Checkin.find().populate("owner sauceId");
		return res.status(200).json({
			message: "Check-ins retrieved successfully",
			checkins,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Something went wrong while retrieving check-ins",
			error: error.message,
		});
	}
};

module.exports = {
	getCheckins,
};
