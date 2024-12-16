const Event = require("../models/event");
const User = require("../models/user");

// Create event
exports.createEvent = async (req, res) => {
  const { title, description, date, location, maxAttendees } = req.body;

  try {
    const event = new Event({
      title,
      description,
      date,
      location,
      maxAttendees,
      image: req.file ? req.file.filename : null,
      createdBy: req.user.id,
    });

    await event.save();
    res.status(201).json({ message: "Event created successfully", event });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// List all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "username");
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Get a single event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate("createdBy", "username");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  const { title, description, date, location, maxAttendees } = req.body;

  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You do not have permission to update this event" });
    }

    // Update event details
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.maxAttendees = maxAttendees || event.maxAttendees;
    event.image = req.file ? req.file.filename : event.image;

    await event.save();
    res.json({ message: "Event updated successfully", event });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You do not have permission to delete this event" });
    }

    await event.remove();
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// RSVP to event
exports.rsvpEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ message: "Event is full" });
    }

    event.attendees.push(req.user.id);
    await event.save();
    res.json({ message: "RSVP successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
