import React, { useState } from "react";
import "./CSS/chatWidget.css";
import { Edit2, Trash2 } from "lucide-react";

const ChatWidget = ({
  widgetID,
  iconFilePath,
  chatHeading,
  lastMessage,
  lastMessageTime,
  notioficationCount,
  permissions,
  handleClick,
  isActive,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  const date = lastMessageTime ? new Date(lastMessageTime) : new Date();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;
  var icon = <img src={iconFilePath} alt="icon" />;
  var isAdmin = permissions == "standard" ? false : true;

  if (iconFilePath == null) {
    var initials = chatHeading
      .split(" ")
      .map((n) => n[0])
      .join("");
    icon = <span className="iconInnitials">{initials}</span>;
  }

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(widgetID);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(widgetID);
  };

  return (
    <div
      id={widgetID}
      className={`chatWidgetWrapper ${isActive ? "active" : ""}`}
      onClick={handleClick}
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
      {isAdmin && (
        <div className="action-buttons">
          <button
            className="action-button edit"
            onClick={handleEditClick}
            title="Edit Group Chat"
          >
            <Edit2 size={20} />
          </button>
          <button
            className="action-button delete"
            onClick={handleDeleteClick}
            title="Delete Group Chat"
          >
            <Trash2 size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
