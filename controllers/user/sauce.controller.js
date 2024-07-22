const { Sauce } = require("../../models/sauce.model.js");
const User = require("../../models/user.model.js");

const addSauce = async (req, res) => {
	try {
		const { name, title, type, description, ingredients } = req.body;
		// add sauce to db
		if (!name) {
			return res.status(400).json({ message: "Sauce name is required" });
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

const requestSauce = async (req, res) => {
	try {
		// make sure other API only use false value sauces because
		// this is not a sauce just a request for that sauce
		const { name, title, description } = req.body;
		if (!name) {
			return res.status(400).json({ message: "Sauce name is required" });
		}
		const user = await User.findOne({ email: req.user.email });
		const sauce = await Sauce.create({
			isRequested: true,
			title: title,
			name: name,
			owner: user.id,
			description: description,
		});
		return res
			.status(200)
			.json({ message: "Sauce Request Submitted Successfully", sauce });
	} catch (error) {
		return res.status(400).json({
			message: "Something went wrong while Submitting a sauce request",
		});
	}
};

module.exports = {
	addSauce,
	requestSauce,
};
