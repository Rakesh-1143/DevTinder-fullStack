const express = require("express");
const userRouter = express.Router();
const Auth = require("../middleware/Auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/user/requests/pending", Auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const pendingRequests = await ConnectionRequest.find({
      toUserId: userId,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photoUrl",
      "about",
      "skills",
      "gender",
      "age",
    ]);

    res.json({
      message: "Your pending connection requests",
      count: pendingRequests.length,
      data: pendingRequests,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.get("/user/request/accepted", Auth, async (req, res) => {
  try {
    const fromUserId = req.user._id;

    const acceptedRequests = await ConnectionRequest.find({
      fromUserId: fromUserId,
      status: "accepted",
    }).populate("toUserId", ["firstName", "lastName"]);

    res.json({
      message: "Users who accepted your requests",
      data: acceptedRequests,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.get("/user/connections", Auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const connections = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);

    res.json({
      message: "Your connections",
      count: connections.length,
      data: connections,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.get("/user/feed", Auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get all connections (accepted, interested, or ignored)
    const allRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    });

    const excludeUserIds = new Set();
    excludeUserIds.add(userId); // exclude self

    // Exclude all users we've interacted with
    allRequests.forEach((conn) => {
      excludeUserIds.add(conn.fromUserId);
      excludeUserIds.add(conn.toUserId);
    });

    const excludeArray = Array.from(excludeUserIds);

    const totalUsers = await User.countDocuments({
      _id: { $nin: excludeArray },
    });

    const feedUsers = await User.find({
      _id: { $nin: excludeArray },
    })
      .skip(skip)
      .limit(limit)
      .select("firstName lastName photoUrl skills about gender age");

    res.json({
      message: "User feed",
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      count: feedUsers.length,
      data: feedUsers,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = userRouter;
