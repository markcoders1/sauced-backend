// Tope Rated Brands Array

// Hot Sauce Map array

// search for specific sauce

// search for specific brand ( return all sauces of a brand )
const { initializeAdmin } = require("../../services/firebase.js");
const admin = initializeAdmin();
const User = require("../../models/user.model.js");
const { Sauce } = require("../../models/sauce.model.js");

// Create a new brand user
const createBrand = async (req, res) => {
	try {
		const { email, password, name, provider, image } = req.body;

		if (!email || !password || !name) {
			return res
				.status(400)
				.json({ message: "Email, password, and name are required." });
		}

		// Check if the user already exists in MongoDB
		let user = await User.findOne({ email });
		if (user) {
			return res
				.status(400)
				.json({ message: "User with this email already exists." });
		}

		// Create a new user in Firebase Authentication
		const firebaseUser = await admin.auth().createUser({
			email: email,
			password: password,
		});

		// Create a new brand user in MongoDB
		user = new User({
			uid: firebaseUser.uid,
			name,
			email,
			provider,
			image,
			type: "brand",
			status: "active",
		});

		await user.save();
		return res.status(201).json({
			message: "Brand created successfully",
			user,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Something went wrong while creating brand",
			error,
		});
	}
};

// Change a user's type to brand
const changeUserToBrand = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({ message: "Email is required." });
		}

		// Find the user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		// Change the user's type to brand
		user.type = "brand";
		await user.save();

		return res.status(200).json({
			message: "User type changed to brand successfully",
			user,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Something went wrong while changing user type to brand",
			error,
		});
	}
};

// Get all sauces for a specific brand
const getBrandSauces = async (req, res) => {
	try {
		const { brandId } = req.params;

		// Find the brand user by ID
		const brand = await User.findById(brandId);
		if (!brand || brand.type !== "brand") {
			return res.status(404).json({ message: "Brand not found." });
		}

		// Find all sauces associated with this brand
		const sauces = await Sauce.find({ owner: brandId });

		return res.status(200).json({
			message: "Sauces retrieved successfully",
			sauces,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message:
				"Something went wrong while retrieving sauces for the brand",
			error,
		});
	}
};

// Demote a brand to a regular user
const demoteBrandToUser = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({ message: "Email is required." });
		}

		// Find the user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		// Check if the user is a brand
		if (user.type !== "brand") {
			return res.status(400).json({ message: "User is not a brand." });
		}

		// Change the user's type to user
		user.type = "user";
		await user.save();

		return res.status(200).json({
			message: "Brand demoted to user successfully",
			user,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Something went wrong while demoting brand to user",
			error,
		});
	}
};

module.exports = {
	createBrand,
	changeUserToBrand,
	getBrandSauces,
	demoteBrandToUser,
};
