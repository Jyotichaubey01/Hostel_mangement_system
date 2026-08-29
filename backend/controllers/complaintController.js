


const Complaint = require("../models/Complaint");

// ==========================================
// CREATE COMPLAINT
// ==========================================
const createComplaint = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "Please provide title and description"
            });
        }

        const complaint = await Complaint.create({
            student: req.user.id,
            title,
            description
        });

        res.status(201).json({
            message: "Complaint created successfully",
            complaint
        });
    } catch (error) {
        console.error("Create Complaint Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// ==========================================
// GET ALL COMPLAINTS - ADMIN
// ==========================================
const getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate("student", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: complaints.length,
            complaints
        });
    } catch (error) {
        console.error("Get Complaints Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// ==========================================
// GET STUDENT'S COMPLAINTS
// ==========================================
const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            student: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            count: complaints.length,
            complaints
        });
    } catch (error) {
        console.error("Get My Complaints Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// ==========================================
// UPDATE COMPLAINT STATUS - ADMIN
// ==========================================
const updateComplaint = async (req, res) => {
    try {
        const { status, adminResponse } = req.body;

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        if (status) {
            complaint.status = status;
        }

        if (adminResponse !== undefined) {
            complaint.adminResponse = adminResponse;
        }

        await complaint.save();

        res.status(200).json({
            message: "Complaint updated successfully",
            complaint
        });
    } catch (error) {
        console.error("Update Complaint Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    createComplaint,
    getComplaints,
    getMyComplaints,
    updateComplaint
};