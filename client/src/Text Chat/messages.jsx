import React from "react";
import InputField from "./inputbox";
import "./CSS/messages.css";
import { useState, useEffect } from "react";
import API_URL from "../config";
import { Edit2, Trash2, Pencil } from "lucide-react";

const TextChat = ({ groupchatId }) => {
  const [messages, setMessages] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");
  const loggedInUser = localStorage.getItem("userEmail");

  const fetchMessages = () => {
    const jwt = localStorage.getItem("token");
    fetch(`${API_URL}/api/get-messages?groupchat_id=${groupchatId}`, {
      method: "GET",
      headers: {
        Authorization: `${jwt}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const text = await response.text();
        return JSON.parse(text);
      })
      .then((data) => {
        setMessages(data.messages);
      })
      .catch((error) => {
        console.error("Error fetching messages", error);
      });
  };

  const handleEditMessage = async (messageId, newContent) => {
    const jwt = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/edit-message`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt,
        },
        body: JSON.stringify({
          message_id: messageId,
          new_message: newContent,
        }),
      });

      if (response.ok) {
        fetchMessages();
        setEditingMessage(null);
        setEditText("");
      } else {
        console.error("Failed to edit message");
      }
    } catch (error) {
      console.error("Error editing message:", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    const jwt = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/delete-message`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt,
        },
        body: JSON.stringify({
          message_id: messageId,
        }),
      });

      if (response.ok) {
        fetchMessages();
      } else {
        console.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [groupchatId]);

  return (
    <div className="text-chat-container">
      <div className="chat-messages">
        {messages &&
          messages.map((message) => (
            <div
              key={message.message_id}
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
                  <span className="message-time">
                    {new Date(message.time_sent).toLocaleTimeString()}
                    {message.edited === 1 && (
                      <span className="edited-indicator" title="Edited">
                        <Pencil size={12} />
                      </span>
                    )}
                  </span>
                </div>
                {editingMessage === message.message_id ? (
                  <div className="edit-message-container">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="edit-message-input"
                    />
                    <div className="edit-actions">
                      <button
                        onClick={() =>
                          handleEditMessage(message.message_id, editText)
                        }
                        className="save-edit-button"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingMessage(null);
                          setEditText("");
                        }}
                        className="cancel-edit-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="message-text">{message.contents}</p>
                )}
                {message.sender_email === loggedInUser && !editingMessage && (
                  <div className="message-actions">
                    <button
                      className="message-action-button edit"
                      onClick={() => {
                        setEditingMessage(message.message_id);
                        setEditText(message.contents);
                      }}
                      title="Edit message"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="message-action-button delete"
                      onClick={() => handleDeleteMessage(message.message_id)}
                      title="Delete message"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
      <InputField onMessageSent={fetchMessages} groupchatId={groupchatId} />
    </div>
  );
};

export default TextChat;
