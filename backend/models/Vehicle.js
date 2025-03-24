const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1900, max: new Date().getFullYear() + 1 },
    licensePlate: { type: String, required: true, trim: true }, // 🔴 Removed unique: true
    status: { type: String, enum: ["active", "inactive", "maintenance", "retired"], default: "active" },
    capacity: { type: Number, required: true, min: 1, max: 15 },
    vehicleType: { type: String, enum: ["Sedan", "SUV", "Hatchback", "Van", "Minivan"], required: true },
    insuranceExpiry: { type: Date, required: true },
    documents: { rcBook: { type: String, required: false } }, // Optional
    fuelType: { type: String, enum: ["Petrol", "Diesel", "Electric", "Hybrid"], required: true },
    mileage: { type: Number, required: true, min: 0 },
    vehiclePicture: { type: String, required: false }, // Optional
    owner: {
      name: { type: String, required: true },
      address: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
