const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const Auth = require("../middleware/Auth");
const requestRouter = express.Router();
const User = require("../models/user");
const {
  sendInterestEmail,
  sendAcceptanceEmail,
} = require("../utils/emailService");

requestRouter.post("/send/request/:status/:userId", Auth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.userId;
    const status = req.params.status;

    // Check if user is trying to send request to themselves
    if (fromUserId.toString() === toUserId.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot send connection request to yourself" });
    }

    const isValidUser = await User.findById(toUserId);
    if (!isValidUser) {
      return res.status(400).json({ message: "No user exists" });
    }

    const allowed = ["interested", "ignored"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid Status" });
    }

    const existingConnection = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: fromUserId, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnection) {
      return res
        .status(400)
        .json({ message: "Connection request already exists" });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    await connectionRequest.save();

    // Send email if status is "interested"
    if (status === "interested") {
      try {
        const fromUser = await User.findById(fromUserId);
        const toUser = await User.findById(toUserId);

        if (fromUser && toUser && toUser.email) {
          console.log(
            `[REQUEST] Attempting to send interest email to ${toUser.email}`,
          );
          const emailSent = await sendInterestEmail(fromUser, toUser);
          console.log(`[REQUEST] Email sent result: ${emailSent}`);
        } else {
          console.warn(
            `[REQUEST] Cannot send email - Missing user data. FromUser: ${!!fromUser}, ToUser: ${!!toUser}, Email: ${toUser?.email}`,
          );
        }
      } catch (emailError) {
        console.error(
          `[REQUEST] Error in email sending: ${emailError.message}`,
        );
      }
    }

    res.json({
      message: `${status} request sent successfully`,
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
requestRouter.post(
  "/request/review/:status/:requestId",
  Auth,
  async (req, res) => {
    try {
      const toUserId = req.user._id;
      const requestId = req.params.requestId;
      const status = req.params.status;

      const allowed = ["accepted", "rejected"];
      if (!allowed.includes(status)) {
        return res.status(400).send("Invalid Status");
      }

      let connectionRequest = await ConnectionRequest.findById(requestId);
      if (!connectionRequest) {
        return res.status(400).send("No request found");
      }

      const fromUserId = connectionRequest.fromUserId;

      if (connectionRequest.toUserId.toString() !== toUserId.toString()) {
        return res
          .status(403)
          .send("You are not allowed to review this request");
      }

      if (connectionRequest.status !== "interested") {
        return res.status(400).send("Request already reviewed");
      }

      connectionRequest.status = status;
      await connectionRequest.save();

      // Send email if status is "accepted"
      if (status === "accepted") {
        try {
          const acceptingUser = await User.findById(toUserId);
          const interestedUser = await User.findById(fromUserId);

          if (acceptingUser && interestedUser && interestedUser.email) {
            console.log(
              `[REQUEST] Attempting to send acceptance email to ${interestedUser.email}`,
            );
            const emailSent = await sendAcceptanceEmail(
              acceptingUser,
              interestedUser,
            );
            console.log(`[REQUEST] Acceptance email sent result: ${emailSent}`);
          } else {
            console.warn(
              `[REQUEST] Cannot send acceptance email - Missing user data. AcceptingUser: ${!!acceptingUser}, InterestedUser: ${!!interestedUser}, Email: ${interestedUser?.email}`,
            );
          }
        } catch (emailError) {
          console.error(
            `[REQUEST] Error in acceptance email sending: ${emailError.message}`,
          );
        }
      }

      res.json({
        message: `Request ${status} successfully`,
        data: connectionRequest,
      });
    } catch (err) {
      res.status(400).send(err.message);
    }
  },
);

module.exports = requestRouter;
