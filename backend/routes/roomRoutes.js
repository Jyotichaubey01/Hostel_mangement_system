const express = require("express");

const router = express.Router();

const {
    createRoom,
    getRooms,
    allocateRoom
} = require("../controllers/roomController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Get all rooms
router.get("/", protect, getRooms);

// Create room — Admin only
router.post("/", protect, adminOnly, createRoom);

// Allocate room — Admin only
router.post("/allocate", protect, adminOnly, allocateRoom);

module.exports = router;