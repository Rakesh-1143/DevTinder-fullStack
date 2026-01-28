// const mongoose = require("mongoose");

// const connectDB = async () => {
//   await mongoose.connect(process.env.MONGODB_URI);
// };
// module.exports = connectDB;
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    console.log("🔎 MONGODB_URI exists:", !!mongoUri);

    if (!mongoUri) {
      throw new Error("MONGODB_URI is missing in environment variables");
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // fail fast if unreachable
    });

    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
    process.exit(1); // stop app if DB fails
  }
};

module.exports = connectDB;
