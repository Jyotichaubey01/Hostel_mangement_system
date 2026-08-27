const Room = require("../models/Room");

// Create a new room
const createRoom = async (req, res) => {
    try {
        const { roomNumber, block, floor, capacity, type } = req.body;

        if (!roomNumber || !block || floor === undefined || !capacity || !type) {
            return res.status(400).json({
                message: "Please provide all room details"
            });
        }

        const existingRoom = await Room.findOne({ roomNumber });

        if (existingRoom) {
            return res.status(400).json({
                message: "Room already exists"
            });
        }

        const room = await Room.create({
            roomNumber,
            block,
            floor,
            capacity,
            type,
            occupants: []
        });

        res.status(201).json({
            message: "Room created successfully",
            room
        });

    } catch (error) {
        console.error("Create Room Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Get all rooms
const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find()
            .populate("occupants", "name email");

        res.status(200).json({
            count: rooms.length,
            rooms
        });

    } catch (error) {
        console.error("Get Rooms Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Allocate room to a student
const allocateRoom = async (req, res) => {
    try {
        const { roomId, studentId } = req.body;

        if (!roomId || !studentId) {
            return res.status(400).json({
                message: "roomId and studentId are required"
            });
        }

        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        if (room.occupants.length >= room.capacity) {
            return res.status(400).json({
                message: "Room is already full"
            });
        }

        if (room.occupants.includes(studentId)) {
            return res.status(400).json({
                message: "Student is already allocated to this room"
            });
        }

        room.occupants.push(studentId);

        await room.save();

        res.status(200).json({
            message: "Room allocated successfully",
            room
        });

    } catch (error) {
        console.error("Allocate Room Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    createRoom,
    getRooms,
    allocateRoom
};