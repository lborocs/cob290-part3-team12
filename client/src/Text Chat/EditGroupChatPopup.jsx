import React, { useState, useEffect } from "react";
import "./CSS/CreateGroupChatPopup.css";
import API_URL from "../config";

const EditGroupChatPopup = ({
  isOpen,
  onClose,
  onGroupChatUpdated,
  groupchatId,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    groupchat_id: groupchatId,
    name: "",
    description: "",
    admin_only_add: false,
    icon_url: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        groupchat_id: groupchatId,
        name: initialData.name || "",
        description: initialData.description || "",
        admin_only_add: initialData.admin_only_add || false,
        icon_url: initialData.icon_url || "",
      });
    }
  }, [initialData, groupchatId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jwt = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/edit-groupchat`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        onGroupChatUpdated(data);
        onClose();
      } else {
        console.error("Failed to update group chat:", data);
      }
    } catch (error) {
      console.error("Error updating group chat:", error);
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
        <h2>Edit Group Chat</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Group Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="icon_url">Icon URL (optional):</label>
            <input
              type="text"
              id="icon_url"
              name="icon_url"
              value={formData.icon_url}
              onChange={handleChange}
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
              Save Changes
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

export default EditGroupChatPopup;
