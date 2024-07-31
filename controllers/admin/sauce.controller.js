const { Sauce, Like } = require("../../models/sauce.model.js");
const User = require("../../models/user.model.js");
const baseUrl = process.env.SERVER_BASE_URL || "/";
const fs = require("fs");

const addSauce = async (req, res) => {
	try {
		const { name, title, type, description, ingredients } = req.body;
		// add sauce to db
		if (!name) {
			return res.status(400).json({ message: "Sauce name is required" });
		}

		if (!req.file) {
			console.log("Image not found");
			return res.status(400).json({ message: "Image not found" });
		}

		const user = await User.findOne({ email: req.user.email });
		const sauce = await Sauce.create({
			isRequested: false,
			title: title,
			name: name,
			type: type,
			owner: user.id,
			description: description,
			ingredients: ingredients,
			image: baseUrl + "uploads/" + req.file.filename,
		});

		return res.status(200).json({
			message: "Sauce Added Successfully",
			sauce,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: "Something went wrong while Adding Sauce",
			error,
		});
	}
};

const changeAnySauceImage = async (req, res) => {
	try {
		//only admin can change image of any sauce without being sauce's owner
		if (!req.file) {
			console.log("Image not found");
			return res.status(400).json({ message: "Image not found" });
		}

		const { sauceId } = req.body;

		const sauce = await Sauce.findOne({ _id: sauceId });
		if (!sauce) {
			return res.status(404).json({
				message: "Sauce not found",
			});
		}

		sauce.image = baseUrl + "uploads/" + req.file.filename;
		const updatedSauce = await sauce.save();

		return res.status(200).json({
			message: "Sauce Image Updated Successfully",
			sauce: updatedSauce,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: "Something went wrong while changing sauce image",
			error,
		});
	}
};

const toggleSauceFeaturedStatus = async (req, res) => {
	try {
		const { sauceId } = req.body;
		let sauce = await Sauce.findById(sauceId);
		if (!sauce) {
			return res.status(404).json({
				message: "Sauce not found",
			});
		}
		// Check if the isRequested flag is false
		if (sauce.isRequested) {
			return res.status(400).json({
				message:
					"Cannot toggle featured status while sauce is requested",
			});
		}
		// Toggle the isFeatured flag using not gate !
		sauce.isFeatured = !sauce.isFeatured;

		// Save and populate the updated sauce object
		await sauce.save();
		await sauce.populate("owner");

		// Determine the appropriate message using ternary operator instead of if-else cuz im fancy like that
		const message = sauce.isFeatured
			? "Sauce Added to Featured List Successfully"
			: "Sauce Removed from Featured List Successfully";

		return res.status(200).json({
			message,
			sauce,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message:
				"Something went wrong while toggling sauce featured status",
			error,
		});
	}
};

// Top Rated sauces array

// Featured Sauces array

// Tope Rated Brands Array

// Hot Sauce Map array

// search for specific sauce

// search for specific brand ( return all sauces of a brand )

// makeSauceFeatured API

module.exports = {
	addSauce,
	changeAnySauceImage,
	toggleSauceFeaturedStatus,
};
