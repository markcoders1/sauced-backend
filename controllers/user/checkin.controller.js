const { Checkin } = require("../../models/checkin.model.js");
const { Sauce } = require("../../models/sauce.model.js");
// const User = require("../../models/user.model.js");
const baseUrl = process.env.SERVER_BASE_URL || "/";
const fs = require("fs");

const checkinSauce = async (req, res) => {
	try {
		const { sauceId, text, longitude, latitude } = req.body;
		const userId = req.user._id;

		// console.log("TEXT: ",text);
		// console.log("sauceId: ", sauceId);
		// console.log("FILES: ", req.files );

		// Validate required fields
		if (!sauceId || !text) {
			return res.status(400).json({ message: "All fields are required" });
		}

		if (!req.files || req.files.length === 0) {
			console.log("Images not found");
			return res.status(400).json({ message: "Images not found" });
		}

		// Verify that the sauce exists
		const sauce = await Sauce.findById(sauceId);
		if (!sauce) {
			return res.status(404).json({ message: "Sauce not found" });
		}

		// Process image files
		const images = req.files.map(
			(file) => baseUrl + "uploads/" + file.filename
		);

		// Create the new check-in object
		const newCheckin = new Checkin({
			owner: userId,
			sauceId,
			text,
			location: {
				longitude,
				latitude,
			},
			images,
		});

		// Save the check-in object to the database
		let savedCheckin = await newCheckin.save();

		// Populate the sauce details
		savedCheckin = await Checkin.findById(savedCheckin._id).populate(
			"sauceId owner"
		);

		return res.status(201).json({
			message: "Check-in created successfully",
			checkin: savedCheckin,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Something went wrong while creating the check-in",
			error: error.message,
		});
	}
};

module.exports = {
	checkinSauce,
};
