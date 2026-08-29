

const express = require("express");

const router = express.Router();

const {
    createFee,
    getFees,
    getStudentFees,
    payFee
} = require("../controllers/feeController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Get all fees — Admin only
router.get("/", protect, adminOnly, getFees);

// Create a fee — Admin only
router.post("/", protect, adminOnly, createFee);

// Get fees for a particular student
router.get("/student/:studentId", protect, getStudentFees);

// Mark fee as paid
router.put("/:id/pay", protect, payFee);

module.exports = router;