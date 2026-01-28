// require("dotenv").config();
// const express = require("express");
// const connectDB = require("./config/database");
// const app = express();
// const path = require("path");
// app.use(express.json());
// const cookieParser = require("cookie-parser");
// const AuthRouter = require("./routers/auth");
// const ProfileRouter = require("./routers/profile");
// const RequestRouter = require("./routers/request");
// const UserRouter = require("./routers/user");
// const cors = require("cors");

// // CORS configuration to allow all localhost ports
// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:5174",
//   "http://localhost:5175",
//   "http://127.0.0.1:5173",
//   "http://127.0.0.1:5174",
//   "http://127.0.0.1:5175",
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   }),
// );
// app.use(cookieParser());

// // Serve uploaded files as static files
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// app.use("/", AuthRouter);
// app.use("/", ProfileRouter);
// app.use("/", RequestRouter);
// app.use("/", UserRouter);

// connectDB()
//   .then(() => {
//     console.log("database connected successfullly");
//     app.listen(process.env.PORT || 5000, () => console.log("server connected"));
//   })
//   .catch((err) => {
//     console.error("Database connection error:", err.message);
//   });

require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const AuthRouter = require("./routers/auth");
const ProfileRouter = require("./routers/profile");
const RequestRouter = require("./routers/request");
const UserRouter = require("./routers/user");

app.use(express.json());
app.use(cookieParser());

// ===== CORS (Production Safe) =====
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  process.env.CLIENT_URL, // Render frontend URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else if (process.env.NODE_ENV === "production") {
        callback(null, true); // allow all in production to avoid crash
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// ===== Static Uploads =====
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ===== Health Check (IMPORTANT for Render) =====
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// ===== Routes =====
app.use("/", AuthRouter);
app.use("/", ProfileRouter);
app.use("/", RequestRouter);
app.use("/", UserRouter);

// ===== Boot Server =====
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Startup failed:", err.message);
    process.exit(1);
  });
