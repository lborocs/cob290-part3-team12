import React from "react";
import InputField from "./inputbox";
import "./CSS/messages.css";
import { useState, useEffect } from "react";
import API_URL from "../config";

const TextChat = ({ groupchatId }) => {
  const [messages, setMessages] = useState([]);
  const loggedInUser = localStorage.getItem("userEmail");

  const fetchMessages = () => {
    const jwt = localStorage.getItem("token");
    console.log(`Token${localStorage.getItem("token")}`);
    fetch(`${API_URL}/api/get-messages?groupchat_id=${groupchatId}`, {
      method: "GET",
      headers: {
        Authorization: `${jwt}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const text = await response.text();
        console.log("Raw response:", text);
        return JSON.parse(text);
      })
      .then((data) => {
        setMessages(data.messages);
        console.log("Fetched messages", data);
      })
      .catch((error) => {
        console.error("Error fetching messages", error);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, [groupchatId]);

  return (
    <div className="text-chat-container">
      <div className="chat-header">
        <div className="profile-picture">
          {/* Placeholder for profile picture */}
          <span className="user-icon">👤</span>
        </div>
        <div className="header-info"></div>
      </div>
      <div className="chat-messages">
        {messages &&
          messages.map((message) => (
            <div
              key={message.id}
              // className={`message ${message.isSent ? 'sent' : 'received'}`}
              className={`message ${
                message.sender_email === loggedInUser ? "sent" : "received"
              }`}
            >
              {!message.isSent && (
                <div className="profile-picture-text">
                  <span className="user-icon">👤</span>
                </div>
              )}
              <div className="message-content">
                <div className="message-info">
                  {!message.isSent && (
                    <span className="message-sender">
                      {message.first_name} {message.last_name}
                    </span>
                  )}
                  <span className="message-time">{message.time}</span>
                </div>
                <p className="message-text">{message.contents}</p>
              </div>
            </div>
          ))}
      </div>
      <InputField onMessageSent={fetchMessages} groupchatId={groupchatId} />
    </div>
  );
};

export default TextChat;
