const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        mobile: { type: String, required: true },
        from: { type: String, required: true },
        to: { type: String, required: true },
        distance: { type: String, required: true },
        duration: { type: String, required: true },
        pickupAddress: { type: String, required: true },
        dropAddress: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        passengers: { type: Number, required: true },
        carName: { type: String, required: true },
        carRate: { type: Number, required: true },
        estimatedCost: { type: Number, required: true },
        paymentMethod: { type: String, enum: ["COD", "Advanced", "Online"], default: "Online" }, // Payment method
        paymentStatus: { type: String, enum: ["Pending", "Paid", "Completed"], default: "Pending" }, // Payment status
        advancePayment: { type: Number, default: 0 }, // Amount paid in advance (for Advanced or Online)
        balancePayment: { type: Number, default: 0 }, // Remaining balance (for COD or Advanced)
        driverAssigned: { type: String, default: "Not Assigned" }, // Driver assignment
        tripStatus: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" }, // Trip status
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true } // Automatically manage createdAt and updatedAt
);
module.exports = mongoose.model("Booking", BookingSchema);