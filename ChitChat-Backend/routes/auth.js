const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register
// Register
router.post("/register", async (req, res) => {
  const { name, username, email, phone, password } = req.body;

  // Ensure all required fields are present
  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      username,
      phone,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// Login
router.post("/login", async (req, res) => {
  const { username, phone, password } = req.body;
  const user = await User.findOne({
    $or: [{ username }, { phone }],
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

module.exports = router;
