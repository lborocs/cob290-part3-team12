import React, { useState } from 'react';
import './ChatHeader.css'; // Assuming you'll add CSS in a separate file

const ChatHeader = () => {
  const [activeButton, setActiveButton] = useState('All'); // State to track active button

  // Handler for button clicks
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    // Add your button functionality here
    console.log(`${buttonName} button clicked`);
  };

  return (
    <div className="chat-header">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search chats..."
          className="search-input"
        />
      </div>
      <div className="button-group">
        <button
          className={`chat-button ${activeButton === 'All' ? 'active' : ''}`}
          onClick={() => handleButtonClick('All')}
        >
          All
        </button>
        <button
          className={`chat-button ${activeButton === 'Unread' ? 'active' : ''}`}
          onClick={() => handleButtonClick('Unread')}
        >
          Unread
        </button>
        <button
          className={`chat-button ${activeButton === 'Favourites' ? 'active' : ''}`}
          onClick={() => handleButtonClick('Favourites')}
        >
          Favourites
        </button>
        <button
          className={`chat-button ${activeButton === 'Groups' ? 'active' : ''}`}
          onClick={() => handleButtonClick('Groups')}
        >
          Groups
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;