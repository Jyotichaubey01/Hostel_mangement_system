
const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        feeType: {
            type: String,
            enum: ["hostel", "mess", "other"],
            required: true
        },

        dueDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "paid"],
            default: "pending"
        },

        paymentDate: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Fee", feeSchema);
