const express = require("express");

const router = express.Router();

// Controllers
const {
    registerUser,
    loginUser
} = require("../controllers/authController");

// Authentication middleware
const { protect } = require("../middleware/authMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Test protected route
router.get("/profile", protect, (req, res) => {
    res.status(200).json({
        message: "Authentication working",
        user: req.user
    });
});

module.exports = router;