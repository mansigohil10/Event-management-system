const express = require("express");
const { createEvent, getEvents, rsvpEvent, updateEvent, deleteEvent } = require("../controllers/eventController");
const authMiddleware = require("../middlewares/authMiddleware");
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const router = express.Router();

router.post("/create", authMiddleware, uploadMiddleware.single("image"), createEvent);
router.get("/", getEvents);
router.post("/:eventId/rsvp", authMiddleware, rsvpEvent);
router.put("/:eventId", authMiddleware, uploadMiddleware.single("image"), updateEvent);
router.delete("/:eventId", authMiddleware, deleteEvent);
module.exports = router;


