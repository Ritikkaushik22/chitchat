// App.js

import React, { useEffect, useState } from "react";
import { Container, TextField, Button, Typography, Paper } from "@mui/material";
import io from "socket.io-client";
import "./App.css";
import LiveMessages from "./components/LiveMessages"; // Ensure this path is correct

const socket = io("http://localhost:5000");

function App() {
  const [userId, setUserId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (userId) {
      socket.emit("join", userId);
    }

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId]);

  const sendMessage = () => {
    if (message && receiverId) {
      const msgData = {
        sender: userId,
        receiver: receiverId,
        content: message,
      };
      socket.emit("sendMessage", msgData);
      setMessages((prevMessages) => [...prevMessages, msgData]);
      setMessage("");
    }
  };

  return (
    <div className="App">
      <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
        <Paper
          elevation={3}
          style={{ padding: "1rem", backgroundColor: "#121212" }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            style={{ color: "#ffffff" }}
          >
            ChitChat - Real-Time Messaging
          </Typography>
          <TextField
            label="Your User ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            InputLabelProps={{ style: { color: "#ffffff" } }}
            InputProps={{
              style: { color: "#ffffff", backgroundColor: "#1a1a1a" },
            }}
          />
          <TextField
            label="Receiver's User ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            InputLabelProps={{ style: { color: "#ffffff" } }}
            InputProps={{
              style: { color: "#ffffff", backgroundColor: "#1a1a1a" },
            }}
          />
          <TextField
            label="Type a message"
            variant="outlined"
            fullWidth
            margin="normal"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            InputLabelProps={{ style: { color: "#ffffff" } }}
            InputProps={{
              style: { color: "#ffffff", backgroundColor: "#1a1a1a" },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            style={{ marginTop: "1rem" }}
          >
            Send
          </Button>
        </Paper>
      </Container>
      <Container>
        <LiveMessages messages={messages} />{" "}
        {/* Pass messages to LiveMessages component */}
      </Container>
    </div>
  );
}

export default App;
