import React, { useState } from "react";
import "./CSS/CreateGroupChatPopup.css";
import API_URL from "../config";

const CreateGroupChatPopup = ({ isOpen, onClose, onGroupChatCreated }) => {
  const [formData, setFormData] = useState({
    groupchat_name: "",
    admin_only_add: false,
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
        setFormData({ groupchat_name: "", admin_only_add: false });
      } else {
        console.error("Failed to create group chat:", data);
      }
    } catch (error) {
      console.error("Error creating group chat:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Create New Group Chat</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="groupchat_name">Group Name:</label>
            <input
              type="text"
              id="groupchat_name"
              name="groupchat_name"
              value={formData.groupchat_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group checkbox-group">
            <label htmlFor="admin_only_add">
              <input
                type="checkbox"
                id="admin_only_add"
                name="admin_only_add"
                checked={formData.admin_only_add}
                onChange={handleChange}
              />
              Admin Only Add
            </label>
          </div>
          <div className="button-group">
            <button type="submit" className="submit-button">
              Create
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupChatPopup;
