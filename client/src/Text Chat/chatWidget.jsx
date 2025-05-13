import React, { useState } from "react";
import "./CSS/chatWidget.css";
import { Edit2, Trash2, UserPlus } from "lucide-react";

const ChatWidget = ({
  widgetID,
  iconFilePath,
  chatHeading,
  lastMessage,
  lastMessageTime,
  notioficationCount,
  handleClick,
  isActive,
  permissions,
  onEdit,
  onDelete,
  onAddUser,
}) => {
  const [showActions, setShowActions] = useState(false);

  const date = lastMessageTime ? new Date(lastMessageTime) : new Date();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;
  var icon = null;  
  var isAdmin = permissions === "standard" ? false : true;

  if (!iconFilePath) {
    var initials = chatHeading
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    icon = <span className="iconInnitials">{initials}</span>;
  }
  else {
    icon = <img src={iconFilePath} alt="icon" />;
  }

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(widgetID);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(widgetID);
  };

  const handleAddUserClick = (e) => {
    e.stopPropagation();
    onAddUser(widgetID);
  };

  return (
    <div
      id={widgetID}
      className={`chatWidgetWrapper ${isActive ? "active" : ""}`}
      onClick={handleClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="section iconCol">
        <div className="imageMask">{icon}</div>
      </div>
      <div className="section contentsCol">
        <h2 className="chatHeading">{chatHeading}</h2>
        <p className="lastMessage">{lastMessage}</p>
      </div>
      <div className="section notificationCol">
        <p>{formattedTime}</p>
        <div className="notificationCount">{notioficationCount}</div>
      </div>
      {showActions && (
        <div className="action-buttons">
          <button
            className="action-button add-user"
            onClick={handleAddUserClick}
            title="Add User"
          >
            <UserPlus size={16} />
          </button>
          {isAdmin && (
            <>
              <button
                className="action-button edit"
                onClick={handleEditClick}
                title="Edit Group Chat"
              >
                <Edit2 size={16} />
              </button>
              <button
                className="action-button delete"
                onClick={handleDeleteClick}
                title="Delete Group Chat"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
