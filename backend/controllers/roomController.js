const Room = require("../models/Room");

// ==========================================
// CREATE A NEW ROOM
// ==========================================
const createRoom = async (req, res) => {
    try {
        // Prevent error if request body is missing
        const body = req.body || {};

        const {
            roomNumber,
            block,
            floor,
            capacity,
            type
        } = body;

        // Validate room details
        if (
            !roomNumber ||
            !block ||
            floor === undefined ||
            capacity === undefined ||
            !type
        ) {
            return res.status(400).json({
                message: "Please provide all room details",
                required: [
                    "roomNumber",
                    "block",
                    "floor",
                    "capacity",
                    "type"
                ]
            });
        }

        // Check whether room already exists
        const existingRoom = await Room.findOne({
            roomNumber
        });

        if (existingRoom) {
            return res.status(400).json({
                message: "Room already exists"
            });
        }

        // Create room
        const room = await Room.create({
            roomNumber,
            block,
            floor,
            capacity,
            type,
            occupants: []
        });

        return res.status(201).json({
            message: "Room created successfully",
            room
        });

    } catch (error) {
        console.error("Create Room Error:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// GET ALL ROOMS
// ==========================================
const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find()
            .populate("occupants", "name email");

        return res.status(200).json({
            count: rooms.length,
            rooms
        });

    } catch (error) {
        console.error("Get Rooms Error:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// ALLOCATE ROOM TO STUDENT
// ==========================================
const allocateRoom = async (req, res) => {
    try {
        const body = req.body || {};

        const {
            roomId,
            studentId
        } = body;

        if (!roomId || !studentId) {
            return res.status(400).json({
                message: "roomId and studentId are required"
            });
        }

        // Find room
        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        // Check capacity
        if (room.occupants.length >= room.capacity) {
            return res.status(400).json({
                message: "Room is already full"
            });
        }

        // Check duplicate student
        if (room.occupants.some(
            occupant => occupant.toString() === studentId
        )) {
            return res.status(400).json({
                message: "Student is already allocated to this room"
            });
        }

        // Add student
        room.occupants.push(studentId);

        await room.save();

        return res.status(200).json({
            message: "Room allocated successfully",
            room
        });

    } catch (error) {
        console.error("Allocate Room Error:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// EXPORT
// ==========================================
module.exports = {
    createRoom,
    getRooms,
    allocateRoom
};