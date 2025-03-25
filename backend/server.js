require("dotenv").config();
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Payment = require("./models/Payment"); // Import the Payment model
const Booking = require("./models/Booking");
const Vehicle = require("./models/Vehicle");
const User = require("./models/User");
const Driver = require("./models/Driver");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");
const axios = require("axios");

const app = express();

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas! 🚀"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


app.use(express.json());
app.use(
  cors({
    origin: "https://frolicking-valkyrie-e639a7.netlify.app", // ✅ your Netlify frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// API Route to Create Payment Order
app.post(
  "/create-order",
  [
    body("amount")
      .isInt({ min: 1 })
      .withMessage("Amount must be a positive integer"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      const { amount } = req.body;
      const options = {
        amount: parseInt(amount) * 100, // Convert to paisa
        currency: "INR",
        receipt: `order_rcptid_${Date.now()}`,
        payment_capture: 1, // Auto-capture payment
      };

      const order = await razorpay.orders.create(options);
      console.log("Order created:", order);
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res
        .status(500)
        .json({ error: "Failed to create order", details: error.message });
    }
  }
);

// API Route to Verify Payment and Store in MongoDB
app.post(
  "/verify-payment",
  [
    body("razorpay_order_id").notEmpty().withMessage("Order ID is required"),
    body("razorpay_payment_id")
      .notEmpty()
      .withMessage("Payment ID is required"),
    body("razorpay_signature").notEmpty().withMessage("Signature is required"),
    body("userEmail").notEmpty().withMessage("User email is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        userEmail,
        rideId,
      } = req.body;
      const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
      hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
      const generated_signature = hmac.digest("hex");

      if (generated_signature === razorpay_signature) {
        console.log("Payment verified:", {
          razorpay_order_id,
          razorpay_payment_id,
        });

        // Fetch payment details from Razorpay
        const paymentDetails = await razorpay.payments.fetch(
          razorpay_payment_id
        );
        if (!paymentDetails) {
          throw new Error("Failed to fetch payment details from Razorpay");
        }

        // Store payment data in MongoDB
        const paymentData = new Payment({
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          amount: paymentDetails.amount / 100, // Convert paisa to INR
          currency: paymentDetails.currency,
          status: "success",
          userEmail,
          phone: paymentDetails.contact || null,
          rideId: rideId || null,
        });

        await paymentData
          .save()
          .then(() => console.log("Payment stored in MongoDB:", paymentData))
          .catch((saveError) => {
            console.error("Failed to save payment to MongoDB:", saveError);
            throw new Error("Database save failed");
          });

        res.json({
          success: true,
          msg: "Payment Verified",
          paymentId: razorpay_payment_id,
        });
      } else {
        console.log("Payment verification failed:", {
          generated_signature,
          razorpay_signature,
        });
        res
          .status(400)
          .json({ success: false, msg: "Payment verification failed" });
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      res
        .status(500)
        .json({ error: "Payment verification error", details: error.message });
    }
  }
);


// ✅ User Login (POST) - Fix Password Hashing Issue
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    // Directly compare plain-text password
    if (password !== user.password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already in use" });

    // Store plain-text password (not secure)
    const newUser = new User({
      name,
      email,
      phone,
      password,
      role: role || "customer",
    });

    await newUser.save();
    res.status(201).json({ message: "User Registered Successfully!" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// ✅ Book a Ride with Distance Calculation

app.post("/book-ride", async (req, res) => {
  const { userId, pickupLocation, dropoffLocation, rideTime, carType } =
    req.body;

  try {
    // Fetch Vehicle Details
    const vehicle = await Vehicle.findOne({ type: carType });
    if (!vehicle)
      return res.status(404).json({ error: "Vehicle type not available" });

    // Calculate Distance (Using Distance Matrix API)
    const apiKey =
      "V4CVqXWy9UPZWWsOnMI5FFHNUulikjIDhh2ZNYNJtXFbIpz8j6JX1qiucOmWp46R";
    const apiUrl = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${pickupLocation.lat},${pickupLocation.lng}&destinations=${dropoffLocation.lat},${dropoffLocation.lng}&key=${apiKey}`;
    const response = await axios.get(apiUrl);

    if (
      !response.data.rows ||
      !response.data.rows[0].elements ||
      !response.data.rows[0].elements[0].distance
    ) {
      return res
        .status(500)
        .json({ error: "Distance data not found in API response" });
    }

    const distanceMeters = response.data.rows[0].elements[0].distance.value;
    const distanceKm = distanceMeters / 1000;

    // Calculate Fare
    const totalFare = vehicle.baseFare + distanceKm * vehicle.pricePerKm;

    // Save Booking
    const newBooking = new Booking({
      userId,
      pickupLocation,
      dropoffLocation,
      rideTime,
      fare: totalFare,
      carType,
      status: "pending",
    });

    await newBooking.save();
    res.status(201).json({
      message: "Ride Booked Successfully!",
      distance: `${distanceKm.toFixed(2)} km`,
      totalFare,
      booking: newBooking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get All Bookings for a User (GET)
app.get("/my-bookings/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// app.post("/register-driver", async (req, res) => {
//   const { name, address, phone, licenseNo } = req.body;
//   try {
//       const excistingDriver = await User.findOne({ licenseNo });
//       if (excistingDriver)
//           return res.status(400).json({ error: "Driver already registered" });

//       const newDriver = new Driver({ name, phone, address, licenseNo });
//       await newDriver.save();

//       res.status(201).json({
//           message: "Driver Registered Successfully",
//           driver: newDriver,
//       });
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// });

// app.get("/drivers", async (req, res) => {
//   try {
//       const drivers = await Driver.find().populate("assignedRides");
//       res.json(drivers);
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// });

// app.put("/assign-ride/:driverId/:bookingId", async (req, res) => {
//   try {
//       const driver = await Driver.findById(req.params.driverId);
//       if (!driver) return res.status(404).json({ error: "Driver not found" });

//       driver.assignedRides.push(req.params.bookingId);
//       await driver.save();

//       res.json({ message: "Ride Assigned to Driver", driver });
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// });

// app.get("/driver-rides/:driverId", async (req, res) => {
//   try {
//       const driver = await Driver.findById(req.params.driverId).populate(
//           "assignedRides"
//       );
//       if (!driver) return res.status(404).json({ error: "Driver not found" });

//       res.json(driver.assignedRides);
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// });

// app.post("/add-vehicle", async (req, res) => {
//   const { name, type, baseFare, pricePerKm, capacity } = req.body;
//   try {
//       const newVehicle = new Vehicle({
//           name,
//           type,
//           baseFare,
//           pricePerKm,
//           capacity,
//       });
//       await newVehicle.save();
//       res.status(201).json({
//           message: "Vehicle Added Successfully",
//           vehicle: newVehicle,
//       });
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// });

// app.get("/vehicles", async (req, res) => {
//   try {
//       const vehicles = await Vehicle.find();
//       res.json(vehicles);
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// });

// app.get("/vehicle/:type", async (req, res) => {
//   try {
//       const vehicles = await Vehicle.findOne({ type: req.params.type });
//       res.json(vehicles);
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// });

// Register Vehicle
app.post("/vehicles-register", async (req, res) => {
  console.log("Received vehicle registration data:", req.body);
  const {
    make,
    model,
    year,
    licensePlate,
    capacity,
    vehicleType,
    insuranceExpiry,
    fuelType,
    mileage,
    vehiclePicture,
    documents,
    owner,
  } = req.body;

  try {
    // ✅ No duplicate check, just insert the new vehicle
    const newVehicle = new Vehicle({
      make,
      model,
      year: Number(year), // Convert to number
      licensePlate,
      capacity: Number(capacity), // Convert to number
      vehicleType,
      insuranceExpiry: new Date(insuranceExpiry), // Convert to Date
      fuelType,
      mileage: Number(mileage), // Convert to number
      vehiclePicture,
      documents: documents || {}, // Default to empty object if undefined
      owner,
    });

    await newVehicle.save();

    res.status(201).json({
      message: "Vehicle registered successfully!",
      vehicle: newVehicle,
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message });
  }
});


// List Vehicles
app.get("/vehicles", async (req, res) => {
  // Updated endpoint
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get Vehicle Details by ID
app.get("/vehicles/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
    res.status(200).json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle details:", error);
    res.status(500).json({ error: error.message });
  }
});

// Register Driver
app.post("/drivers-register", async (req, res) => {
  console.log("Received driver registration data:", req.body);
  const { name, phone, address, licenseNo, ownCar, photo, documents } =
    req.body;
  try {
    const existingDriverByPhone = await Driver.findOne({ phone });
    if (existingDriverByPhone)
      return res.status(400).json({ error: "Phone number already in use" });

    const existingDriverByLicense = await Driver.findOne({ licenseNo });
    if (existingDriverByLicense)
      return res.status(400).json({ error: "License number already in use" });

    const newDriver = new Driver({
      name,
      phone,
      address,
      licenseNo,
      ownCar,
      photo,
      documents,
    });
    await newDriver.save();
    res.status(201).json({ message: "Driver registered successfully!" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message });
  }
});

// List Drivers
app.get("/drivers", async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get Driver Details by ID
app.get("/drivers/:id", async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ error: "Driver not found" });
    res.status(200).json(driver);
  } catch (error) {
    console.error("Error fetching driver details:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Protected Route (Only Accessible with Valid JWT Token)
app.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Welcome, authorized user!", user: req.user });
});

app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update Booking by ID (PUT)
app.put("/bookings/:id", authMiddleware, async (req, res) => {
  console.log("📩 Received PUT request for booking:", req.params.id, req.body);

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      console.log("🚫 Booking not found.");
      return res.status(404).json({ error: "Booking not found" });
    }

    Object.assign(booking, req.body);
    booking.updatedAt = new Date();
    await booking.save();

    console.log("✅ Booking updated successfully:", booking);
    res.status(200).json(booking);
  } catch (error) {
    console.error("❌ Error updating booking:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
