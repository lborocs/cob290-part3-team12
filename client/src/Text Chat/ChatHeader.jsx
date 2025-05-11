import React, { useState } from "react";
import "./CSS/ChatHeader.css"; // Assuming you'll add CSS in a separate file
import CreateGroupChatPopup from "./CreateGroupChatPopup";

const ChatHeader = () => {
  const [activeButton, setActiveButton] = useState("All"); // State to track active button
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Handler for button clicks
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    // Add your button functionality here
    console.log(`${buttonName} button clicked`);
  };

  const handleGroupChatCreated = (newGroupChat) => {
    // You can add any additional logic here if needed
    console.log("New group chat created:", newGroupChat);
  };

  return (
    <div className="chat-header">
      <div className="header-top">
        <input
          type="text"
          placeholder="Search chats..."
          className="search-input"
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
