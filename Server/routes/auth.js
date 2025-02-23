const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Sign Up
router.post("/signup", async (req, res) => {
  try {
    console.log("Signup request received:", req.body);
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      console.log("Missing required fields");
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        missing: {
          username: !username,
          email: !email,
          password: !password,
        },
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log("User already exists:", { email, username });
      return res.status(400).json({
        success: false,
        message: `User with this ${
          existingUser.email === email ? "email" : "username"
        } already exists`,
      });
    }

    // Hash password / Password Encryption
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    console.log("User saved successfully:", savedUser._id);

    // Create token
    const token = jwt.sign({ userId: savedUser._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    const response = {
      success: true,
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
    };

    console.log("Sending response:", response);
    return res.status(201).json(response);
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", { email: req.body.email });
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log("Missing required fields");
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log("Invalid password for user:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create token
    const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    console.log("Login successful for user:", email);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

module.exports = router;
