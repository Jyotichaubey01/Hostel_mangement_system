
const Room = require('../models/Room');

// Create a room (admin only)
const createRoom = async (req, res) => {
  try {
    const { roomNumber, block, floor, capacity, type } = req.body;

    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room number already exists' });
    }

    const room = await Room.create({ roomNumber, block, floor, capacity, type });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all rooms
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate('occupants', 'name email');
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Allocate a student to a room (admin only)
const allocateRoom = async (req, res) => {
  try {
    const { roomId, studentId } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.occupants.length >= room.capacity) {
      return res.status(400).json({ message: 'Room is full' });
    }

    if (room.occupants.includes(studentId)) {
      return res.status(400).json({ message: 'Student already allocated to this room' });
    }

    room.occupants.push(studentId);
    await room.save();

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRoom, getRooms, allocateRoom };