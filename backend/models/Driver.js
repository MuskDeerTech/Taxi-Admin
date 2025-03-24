const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^\+?\d{10,15}$/, "Phone number must be 10-15 digits with optional country code"],
    },
    address: {
      type: String,
      required: true,
    },
    licenseNo: {
      type: String,
      required: true,
      unique: true,
    },
    ownCar: {
      type: Boolean,
      default: false,
    },
    photo: {
      type: String, // Optional
      required: false,
    },
    documents: {
      licensePhoto: { type: String, required: false }, // Optional
    },
    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle", // Updated reference
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);