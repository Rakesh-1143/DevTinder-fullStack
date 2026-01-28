const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    password,
    email,
    gender,
    age,
    about,
    photoUrl,
    skills,
  } = req.body;

  try {
    // Validate required fields
    if (!firstName || !email || !password) {
      return res.status(400).json({
        error: "firstName, email, and password are required",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      password: hashPassword,
      email,
      gender,
      age,
      about,
      photoUrl,
      skills,
    });
    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    // Handle specific validation errors
    let errorMessage = err.message;

    if (err.message.includes("minLength")) {
      errorMessage = "First name must be at least 4 characters";
    } else if (err.message.includes("unique")) {
      errorMessage =
        "Email already exists. Please login or use a different email";
    } else if (err.message.includes("invalid emai")) {
      errorMessage = "Please enter a valid email address";
    }

    res.status(400).json({ message: errorMessage, error: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Email or password is incorrect. Please check and try again.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Email or password is incorrect. Please check and try again.",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production with HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      gender: user.gender,
      about: user.about,
      photoUrl: user.photoUrl,
      skills: user.skills,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error. Please try again.", error: err.message });
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  res.json({
    message: "Logged out successfully",
  });
});
module.exports = authRouter;
