const { Event } = require("../../models/event.model.js");

const addEvent = async (req, res) => {
	try {
		if (req.user.type != "admin")
			return res.status(401).send({ message: "Access denied." });

		let {
			eventName,
			eventDetails,
			eventDate,
			owner,
			venueName,
			venueDescription,
			venueLocation,
		} = req.body;

		if (!owner) {
			const owner = req.user._id;
		}

		const event = await Event.create({
			eventName: eventName,
			eventDetails: eventDetails,
			eventDate: eventDate,
			owner: owner,
			venueName: venueName,
			venueDescription: venueDescription,
			venueLocation: venueLocation,
		});
		console.log(event);

		return res
			.status(200)
			.json({ message: "Event Added Successfully ", event });
	} catch (error) {
		return res
			.status(400)
			.json({ message: "Something went wrong while adding event" });
	}
};

module.exports = {
	addEvent,
};
