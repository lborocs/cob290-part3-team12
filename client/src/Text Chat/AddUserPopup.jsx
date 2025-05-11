import React, { useState, useEffect } from "react";
import "./CSS/CreateGroupChatPopup.css";
import API_URL from "../config";

const AddUserPopup = ({ isOpen, onClose, groupchatId }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && groupchatId) {
      fetchUsers();
    }
  }, [isOpen, groupchatId]);

  const fetchUsers = async () => {
    const jwt = localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/get-users/${groupchatId}`, {
        headers: {
          Authorization: jwt,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users);
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (error) {
      setError("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userEmail) => {
    const jwt = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/add-user-to-groupchat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt,
        },
        body: JSON.stringify({
          groupchat_id: groupchatId,
          email: userEmail,
        }),
      });

      if (response.ok) {
        // Update the user's membership status in the local state
        setUsers(
          users.map((user) =>
            user.email === userEmail
              ? { ...user, is_member: true, permission: "member" }
              : user
          )
        );
      } else {
        const data = await response.json();
        setError(data.error || "Failed to add user");
      }
    } catch (error) {
      setError("Error adding user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const email = user.email.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Add Users to Group Chat</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          <div className="users-list">
            {filteredUsers.map((user) => (
              <div key={user.email} className="user-item">
                <div className="user-info">
                  <span className="user-name">
                    {user.first_name} {user.last_name}
                  </span>
                  <span className="user-email">{user.email}</span>
                </div>
                {user.is_member ? (
                  <span className="member-badge">
                    {user.permission === "admin" ? "Admin" : "Member"}
                  </span>
                ) : (
                  <button
                    className="add-user-button"
                    onClick={() => handleAddUser(user.email)}
                  >
                    Add
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="button-group">
          <button type="button" className="cancel-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserPopup;
