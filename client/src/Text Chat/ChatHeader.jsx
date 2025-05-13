import React, { useState, useEffect } from "react";
import "./CSS/ChatHeader.css"; // Assuming you'll add CSS in a separate file
import CreateGroupChatPopup from "./CreateGroupChatPopup";

const ChatHeader = ({ onChatListUpdate, onSearch }) => {
  const [activeButton, setActiveButton] = useState("All"); // State to track active button
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  // Handler for button clicks
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    // Add your button functionality here
    console.log(`${buttonName} button clicked`);
  };

  // Update parent with search query whenever it changes
  useEffect(() => {
    onSearch?.(searchQuery);
  }, [searchQuery, onSearch]);

  const handleGroupChatCreated = (newGroupChat) => {
    if (onChatListUpdate) {
      onChatListUpdate();
    }
  };

  return (
    <div className="chat-header">
      <div className="header-top">
        <input
          type="text"
          placeholder="Search chats..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="create-chat-button"
          onClick={() => setIsPopupOpen(true)}
        >
          Create Group Chat
        </button>
      </div>
      <div className="button-group">
        <button
          className={`chat-button ${activeButton === "All" ? "active" : ""}`}
          onClick={() => handleButtonClick("All")}
        >
          All
        </button>
        <button
          className={`chat-button ${activeButton === "Unread" ? "active" : ""}`}
          onClick={() => handleButtonClick("Unread")}
        >
          Unread
        </button>
        <button
          className={`chat-button ${
            activeButton === "Favourites" ? "active" : ""
          }`}
          onClick={() => handleButtonClick("Favourites")}
        >
          Favourites
        </button>
        <button
          className={`chat-button ${activeButton === "Groups" ? "active" : ""}`}
          onClick={() => handleButtonClick("Groups")}
        >
          Groups
        </button>
      </div>
      <CreateGroupChatPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onGroupChatCreated={handleGroupChatCreated}
      />
    </div>
  );
};

export default ChatHeader;
