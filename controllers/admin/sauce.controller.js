const { Sauce, Like } = require("../../models/sauce.model.js");
const User = require("../../models/user.model.js");
const baseUrl = process.env.SERVER_BASE_URL || "/";
const fs = require("fs");

const addSauce = async (req, res) => {
	try {
		const { name, title, type, description, ingredients } = req.body;
		if (!name) {
			return res.status(400).json({ message: "Sauce name is required" });
		}

		if (!req.files || !req.files.image || !req.files.bannerImage) {
			console.log("Image or Banner Image not found");
			return res
				.status(400)
				.json({ message: "Image or Banner Image not found" });
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
			image: baseUrl + "uploads/" + req.files.image[0].filename,
			bannerImage:
				baseUrl + "uploads/" + req.files.bannerImage[0].filename,
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

const toggleSauceFeaturedStatus = async (req, res) => {
	try {
		const { sauceId } = req.body;
		let sauce = await Sauce.findById(sauceId);
		if (!sauce) {
			return res.status(404).json({
				message: "Sauce not found",
			});
		}
		if (sauce.isRequested) {
			return res.status(400).json({
				message:
					"Cannot toggle featured status while sauce is requested",
			});
		}
		sauce.isFeatured = !sauce.isFeatured;
		await sauce.save();
		await sauce.populate("owner");

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

const editSauce = async (req, res) => {
	try {
		const {
			sauceId,
			name,
			title,
			type,
			description,
			ingredients,
			websiteLink,
			productLink,
		} = req.body;
		if (!sauceId) {
			return res.status(400).json({ message: "Sauce ID is required" });
		}

		let sauce = await Sauce.findById(sauceId);
		if (!sauce) {
			return res.status(404).json({ message: "Sauce not found" });
		}

		sauce.name = name || sauce.name;
		sauce.title = title || sauce.title;
		sauce.type = type || sauce.type;
		sauce.description = description || sauce.description;
		sauce.ingredients = ingredients || sauce.ingredients;
		sauce.websiteLink = websiteLink || sauce.websiteLink;
		sauce.productLink = productLink || sauce.productLink;

		if (req.files) {
			if (req.files.image) {
				sauce.image =
					baseUrl + "uploads/" + req.files.image[0].filename;
			}
			if (req.files.bannerImage) {
				sauce.bannerImage =
					baseUrl + "uploads/" + req.files.bannerImage[0].filename;
			}
		}

		const updatedSauce = await sauce.save();
		await updatedSauce.populate("owner");

		return res.status(200).json({
			message: "Sauce Updated Successfully",
			sauce: updatedSauce,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: "Something went wrong while updating sauce",
			error,
		});
	}
};

module.exports = {
	addSauce,
	toggleSauceFeaturedStatus,
	editSauce,
};

// Tope Rated Brands Array

// Hot Sauce Map array

// search for specific sauce

// search for specific brand ( return all sauces of a brand )

// makeSauceFeatured API
