
const express = require("express");

const router = express.Router();

const {
    createComplaint,
    getComplaints,
    getMyComplaints,
    updateComplaint
} = require("../controllers/complaintController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Student - create complaint
router.post("/", protect, createComplaint);

// Admin - get all complaints
router.get("/", protect, adminOnly, getComplaints);

// Student - get own complaints
router.get("/my", protect, getMyComplaints);

// Admin - update complaint
router.put("/:id", protect, adminOnly, updateComplaint);

module.exports = router;