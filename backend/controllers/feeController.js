
const Fee = require("../models/Fee");

// Create a fee
const createFee = async (req, res) => {
    try {
        const { student, amount, feeType, dueDate } = req.body;

        if (!student || amount === undefined || !feeType || !dueDate) {
            return res.status(400).json({
                message: "Please provide student, amount, feeType and dueDate"
            });
        }

        const fee = await Fee.create({
            student,
            amount,
            feeType,
            dueDate
        });

        res.status(201).json({
            message: "Fee created successfully",
            fee
        });
    } catch (error) {
        console.error("Create Fee Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Get all fees
const getFees = async (req, res) => {
    try {
        const fees = await Fee.find()
            .populate("student", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: fees.length,
            fees
        });
    } catch (error) {
        console.error("Get Fees Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Get fees for a particular student
const getStudentFees = async (req, res) => {
    try {
        const fees = await Fee.find({
            student: req.params.studentId
        })
            .populate("student", "name email role")
            .sort({ dueDate: 1 });

        res.status(200).json({
            count: fees.length,
            fees
        });
    } catch (error) {
        console.error("Get Student Fees Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Mark a fee as paid
const payFee = async (req, res) => {
    try {
        const fee = await Fee.findById(req.params.id);

        if (!fee) {
            return res.status(404).json({
                message: "Fee not found"
            });
        }

        fee.status = "paid";
        fee.paymentDate = new Date();

        await fee.save();

        res.status(200).json({
            message: "Fee marked as paid",
            fee
        });
    } catch (error) {
        console.error("Pay Fee Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    createFee,
    getFees,
    getStudentFees,
    payFee
};