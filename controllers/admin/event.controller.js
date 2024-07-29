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

const deleteEvent = async (req, res) => {
	try {
		if (req.user.type !== "admin") {
			return res.status(401).send({ message: "Access denied." });
		}

		const { eventId } = req.body;

		if (!eventId) {
			return res.status(400).json({ message: "Event ID is required." });
		}

		const event = await Event.findById(eventId);

		if (!event) {
			return res.status(404).json({ message: "Event not found." });
		}

		await Event.findByIdAndDelete(eventId);

		return res.status(200).json({ message: "Event deleted successfully." });
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: "Something went wrong while deleting the event.",
		});
	}
};

const getEvent = async (req, res) => {
	try {
		const { eventId } = req.body;
		const event = await Event.findById(eventId).populate("owner", "name");
		if (!event) {
			return res.status(404).json({ message: "Event not found." });
		}
		return res.status(200).json({ event });
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: "Something went wrong while fetching the event.",
		});
	}
};

const getAllEvents = async (req, res) => {
	try {
		const events = await Event.find().populate("owner", "name");
		return res.status(200).json({ events });
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ message: "Something went wrong while fetching events." });
	}
};

const updateEvent = async (req, res) => {
	try {
		if (req.user.type !== "admin") {
			return res.status(401).send({ message: "Access denied." });
		}
		const {
			eventId,
			eventName,
			eventDetails,
			eventDate,
			venueName,
			venueDescription,
			venueLocation,
		} = req.body;

		if (!eventId) {
			return res.status(400).json({ message: "Event ID is required." });
		}

		const event = await Event.findById(eventId);
		if (!event) {
			return res.status(404).json({ message: "Event not found." });
		}
		// Update the event fields
		event.eventName = eventName || event.eventName;
		event.eventDetails = eventDetails || event.eventDetails;
		event.eventDate = eventDate || event.eventDate;
		event.venueName = venueName || event.venueName;
		event.venueDescription = venueDescription || event.venueDescription;
		event.venueLocation = venueLocation || event.venueLocation;

		await event.save();
		return res
			.status(200)
			.json({ message: "Event updated successfully", event });
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			message: "Something went wrong while updating the event.",
		});
	}
};

module.exports = {
	addEvent,
	deleteEvent,
	getEvent,
	getAllEvents,
	updateEvent,
};
