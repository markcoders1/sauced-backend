const { Event } = require("../../models/event.model.js");
const User = require("../../models/user.model.js");

const addEvent = async (req, res) => {
	try {
		if (req.user.type != "admin")
			return res.status(401).send({ message: "Access denied." });

		let {
			eventName,
			eventDetails,
			eventDate,
			// owner,
			venueName,
			venueDescription,
			venueLocation,
		} = req.body;

		// if (!owner) {
		// 	owner = req.user._id; //if req.body me owner ki field ni to req.user se lelo
		// }

		let owner = req.user._id;

		let event = new Event({
			eventName: eventName,
			eventDetails: eventDetails,
			eventDate: eventDate,
			owner: owner,
			venueName: venueName,
			venueDescription: venueDescription,
			venueLocation: venueLocation,
		});

		await event.save();

		await event.populate("owner", "name");
		// console.log(event);

		return res
			.status(200)
			.json({ message: "Event Added Successfully ", event });
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ message: "Something went wrong while adding event" });
	}
};

module.exports = {
	addEvent,
};
