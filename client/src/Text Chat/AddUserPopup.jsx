import React, { useState, useEffect } from "react";
import "./CSS/CreateGroupChatPopup.css";
import API_URL from "../config";

const AddUserPopup = ({ isOpen, onClose, groupchatId }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserPermission, setCurrentUserPermission] = useState(null);

  useEffect(() => {
    if (isOpen && groupchatId) {
      fetchUsers();
      // Get current user's email from localStorage
      const loggedInUser = localStorage.getItem("userEmail");
      setCurrentUserEmail(loggedInUser);
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
        console.log("Group Chat Users:", JSON.stringify(data.users, null, 2));
        // Find current user's permission
        const currentUser = data.users.find(
          (user) => user.email === currentUserEmail
        );
        if (currentUser) {
          console.log("Current User:", JSON.stringify(currentUser, null, 2));
          setCurrentUserPermission(currentUser.permission);
        }
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
      const response = await fetch(`${API_URL}/api/create-membership`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt,
        },
        body: JSON.stringify({
          groupchat_id: groupchatId,
          recipient_email: userEmail,
        }),
      });

      if (response.ok) {
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

  const handleUpdatePermission = async (userEmail, newLevel) => {
    const jwt = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/edit-membership-level`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt,
        },
        body: JSON.stringify({
          groupchat_id: groupchatId,
          recipient_email: userEmail,
          new_level: newLevel,
        }),
      });

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user.email === userEmail ? { ...user, permission: newLevel } : user
          )
        );
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update user permission");
      }
    } catch (error) {
      setError("Error updating user permission");
    }
  };

  const handleRemoveUser = async (userEmail) => {
    const jwt = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/delete-membership`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt,
        },
        body: JSON.stringify({
          groupchat_id: groupchatId,
          recipient_email: userEmail,
        }),
      });

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user.email === userEmail
              ? { ...user, is_member: false, permission: null }
              : user
          )
        );
      } else {
        const data = await response.json();
        setError(data.error || "Failed to remove user");
      }
    } catch (error) {
      setError("Error removing user");
    }
  };

  const filteredUsers = users
    .filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const email = user.email.toLowerCase();
      const search = searchTerm.toLowerCase();
      return fullName.includes(search) || email.includes(search);
    })
    .sort((a, b) => {
      // Sort current user to top
      if (a.email === currentUserEmail) return -1;
      if (b.email === currentUserEmail) return 1;
      return 0;
    });

  const canManageUser = (user) => {
    // Can manage if admin and it's not their own account
    return currentUserPermission === "admin" && user.email !== currentUserEmail;
  };

  const canRemoveUser = (user) => {
    // Can remove if admin and it's not their own account
    return currentUserPermission === "admin" && user.email !== currentUserEmail;
  };

  const canAddUser = (user) => {
    // Any member can add new users
    return user.is_member === 1;
  };

  const canLeave = (user) => {
    //can leave a gc
    return user.email === currentUserEmail;
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Manage Group Members</h2>
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
              <div
                key={user.email}
                className={`user-item ${
                  user.email === currentUserEmail ? "current-user" : ""
                }`}
              >
                <div className="user-info">
                  <span className="user-name">
                    {user.first_name} {user.last_name}
                  </span>
                  {user.is_member === 1 && (
                    <span className={`member-badge ${user.permission}`}>
                      {user.permission}
                    </span>
                  )}
                </div>
                <div className="user-actions">
                  {user.is_member ? (
                    <>
                      {canManageUser(user) && (
                        <>
                          {user.permission === "admin" ? (
                            <button
                              className="action-button demote"
                              onClick={() =>
                                handleUpdatePermission(user.email, "member")
                              }
                              title="Demote to Member"
                            >
                              Demote
                            </button>
                          ) : (
                            <button
                              className="action-button promote"
                              onClick={() =>
                                handleUpdatePermission(user.email, "admin")
                              }
                              title="Promote to Admin"
                            >
                              Promote
                            </button>
                          )}
                        </>
                      )}
                      {canRemoveUser(user) && (
                        <button
                          className="action-button remove"
                          onClick={() => handleRemoveUser(user.email)}
                          title="Remove from Group"
                        >
                          Remove
                        </button>
                      )}
                      {canLeave(user) && (
                        <button
                          className="action-button remove"
                          onClick={() => handleRemoveUser(user.email)}
                          title="Leave Group"
                        >
                          Leave Group
                        </button>
                      )}
                    </>
                  ) : (
                    canAddUser(
                      users.find((u) => u.email === currentUserEmail)
                    ) && (
                      <button
                        className="add-user-button"
                        onClick={() => handleAddUser(user.email)}
                      >
                        Add
                      </button>
                    )
                  )}
                </div>
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
