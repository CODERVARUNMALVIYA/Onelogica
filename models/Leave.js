const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee", // Reference to Employee model
        required: true,
    },
    leaveType: {
        type: String,
        enum: ["vacation", "sick", "personal"],
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.startDate; // Ensure endDate is after startDate
            },
            message: 'End date must be after start date',
        },
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    reason: {
        type: String,
    }
}, { timestamps: true });

const Leave = mongoose.model("Leave", leaveSchema);
module.exports = Leave;
