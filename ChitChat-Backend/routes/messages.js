const express = require("express");
const router = express.Router();
const { io } = require("../index");
const Message = require("../models/Message"); // Update the path as necessary

const mongoose = require("mongoose");

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate the userId to ensure it's a valid ObjectID
    const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);
    if (!isValidObjectId) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const messages = await Message.find({
      receiver: userId,
    })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .exec();

    console.log("Retrieved messages:", messages);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/send", async (req, res) => {
  const { sender, receiver, content } = req.body;

  const message = new Message({
    sender,
    receiver,
    content,
  });

  try {
    await message.save();

    // Notify the receiver in real-time if they are online
    io.to(receiver.toString()).emit("receiveMessage", message);

    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
