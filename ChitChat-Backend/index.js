const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Socket.IO Setup
const users = {}; // Dictionary to store userId-to-socketId mappings

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  // Listen for a 'join' event to map userId to socketId
  socket.on("join", (userId) => {
    users[userId] = socket.id; // Store the user's socket ID
    console.log("User joined:", userId, "with socket ID:", socket.id);
  });

  // Listen for 'sendMessage' event to send messages to specific users
  socket.on("sendMessage", ({ sender, receiver, content }) => {
    const receiverSocketId = users[receiver]; // Look up receiver's socket ID

    if (receiverSocketId) {
      // Send the message to the receiver's socket if they are connected
      io.to(receiverSocketId).emit("receiveMessage", { sender, content });
    } else {
      console.log("Receiver is not connected.");
    }
  });

  // Remove user from the 'users' dictionary when they disconnect
  socket.on("disconnect", () => {
    for (const [userId, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[userId];
        console.log("User disconnected:", userId);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
