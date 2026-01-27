require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const path = require("path");
app.use(express.json());
const cookieParser = require("cookie-parser");
const AuthRouter = require("./routers/auth");
const ProfileRouter = require("./routers/profile");
const RequestRouter = require("./routers/request");
const UserRouter = require("./routers/user");
const cors = require("cors");

// CORS configuration to allow all localhost ports
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(cookieParser());

// Serve uploaded files as static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/", AuthRouter);
app.use("/", ProfileRouter);
app.use("/", RequestRouter);
app.use("/", UserRouter);

connectDB()
  .then(() => {
    console.log("database connected successfullly");
    app.listen(process.env.PORT || 5000, () => console.log("server connected"));
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });
