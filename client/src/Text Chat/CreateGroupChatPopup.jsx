import React, { useState } from "react";
import "./CSS/CreateGroupChatPopup.css";
import API_URL from "../config";

const CreateGroupChatPopup = ({ isOpen, onClose, onGroupChatCreated }) => {
  const [formData, setFormData] = useState({
    groupchat_name: "",
    description: "",
    icon_url: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jwt = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/create-groupchat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        onGroupChatCreated(data);
        onClose();
        setFormData({
          groupchat_name: "",
          description: "",
          icon_url: "",
        });
      } else {
        console.error("Failed to create group chat:", data);
      }
    } catch (error) {
      console.error("Error creating group chat:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Create New Group Chat</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-wrapper">
          <div className="form-group">
            <label htmlFor="groupchat_name">Group Name:</label>
            <input
            className="chat-pop-up-inputfield"
            placeholder="Please type your groupchat name here ..."
              type="text"
              id="groupchat_name"
              name="groupchat_name"
              value={formData.groupchat_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              className="chat-pop-up-description"
              placeholder="Please type your groupchat description here ..."
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="icon_url">Icon URL (optional):</label>
            <input
            className="chat-pop-up-inputfield"
            placeholder="Please paste your image url here ..."
              type="text"
              id="icon_url"
              name="icon_url"
              value={formData.icon_url}
              onChange={handleChange}
              
            />
          </div>
          </div>
          <div className="button-group">
            <button type="button" className="groupchat-button cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="groupchat-button submit">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupChatPopup;
