const express = require("express");
const profileRouter = express.Router();
const Auth = require("../middleware/Auth");
const User = require("../models/user");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Files will be stored in uploads folder
  },
  filename: (req, file, cb) => {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter to accept only image files
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/avif",
    "image/jpg",
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image files (JPEG, PNG, GIF, WebP, AVIF) are allowed"),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

profileRouter.get("/profile/view", Auth, async (req, res) => {
  try {
    const id = req.user._id;
    const user = await User.findById(id);
    res.status(200).json({
      message: "Profile data fetched successfully",
      user,
    });
  } catch (err) {
    res.status(403).send("Invalid or expired token");
  }
});

profileRouter.patch("/profile/edit", Auth, async (req, res) => {
  try {
    const loggedUserId = req.user._id;
    const update = req.body;
    const allowed_updates = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "about",
      "photoUrl",
      "skills",
    ];
    const updatekeys = Object.keys(update);

    const isValidUpdate = updatekeys.every((key) =>
      allowed_updates.includes(key),
    );

    if (!isValidUpdate) {
      return res
        .status(400)
        .send(
          "Invalid fields. Only allowed fields: firstName, lastName, age, gender, about, photoUrl, skills",
        );
    }
    const user = await User.findByIdAndUpdate(loggedUserId, update, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// File upload endpoint
profileRouter.post(
  "/profile/upload",
  Auth,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = req.user._id;
      const photoUrl = `/uploads/${req.file.filename}`;

      const user = await User.findByIdAndUpdate(
        userId,
        { photoUrl },
        { new: true, runValidators: true },
      );

      res.status(200).json({
        message: "Photo uploaded successfully",
        photoUrl,
        user,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
);

// Error handling middleware for multer errors
profileRouter.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "FILE_TOO_LARGE") {
      return res
        .status(400)
        .json({ message: "File size must be less than 5MB" });
    }
    return res
      .status(400)
      .json({ message: "File upload error: " + err.message });
  } else if (err) {
    // Custom file filter errors
    return res.status(400).json({ message: err.message });
  }
  next();
});

module.exports = profileRouter;
