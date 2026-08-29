const dns = require("dns");

// Use Google DNS for MongoDB Atlas connection
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

// ==========================================
// DATABASE CONNECTION
// ==========================================
connectDB();

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// ==========================================
// ROUTES
// ==========================================

// Authentication
app.use("/api/auth", require("./routes/authRoutes"));

// Room Management
app.use("/api/rooms", require("./routes/roomRoutes"));

// Fee Management
app.use("/api/fees", require("./routes/feeRoutes"));

// ==========================================
// TEST ROUTE
// ==========================================
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hostel Management System API is running"
    });
});

// ==========================================
// ERROR HANDLER
// ==========================================
app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(500).json({
        message: "Internal server error",
        error: err.message
    });
});

// ==========================================
// SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}`);
});