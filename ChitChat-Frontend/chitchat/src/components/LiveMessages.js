// LiveMessages.js

import React from "react";

const LiveMessages = ({ messages }) => {
  return (
    <div className="live-messages">
      <h2 style={{ color: "#ffffff" }}>Live Messages</h2>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ margin: "10px 0", color: "#ffffff" }}>
            <strong>{msg.sender}: </strong>
            {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveMessages;
