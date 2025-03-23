import React from 'react';
import InputField from './inputbox';
import './messages.css'; 

const TextChat = () => {

    const messages = [
        {
          id: 1,
          sender: 'Albin Varghese',
          time: 'Monday 14:24',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          isSent: false,
        },
        {
          id: 2,
          sender: 'You',
          time: 'Monday 14:25',
          text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          isSent: true,
        },
        {
          id: 3,
          sender: 'Albin Varghese',
          time: 'Monday 14:26',
          text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
          isSent: false,
        },
        {
          id: 4,
          sender: 'You',
          time: 'Monday 14:27',
          text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          isSent: true,
        },
      ];


      return (
        <div className="text-chat-container">
          <div className="chat-header">
            <div className="profile-picture">
              {/* Placeholder for profile picture */}
              <span className="user-icon">👤</span> 
            </div>
            <div className="header-info">
              <h2>Albin Varghese</h2>
            </div>
          </div>
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.isSent ? 'sent' : 'received'}`}
              >
                {!message.isSent && (
                  <div className="profile-picture-text">
                    <span className="user-icon">👤</span>
                  </div>
                )}
                <div className="message-content">
                  <div className="message-info">
                    {!message.isSent && (
                      <span className="message-sender">{message.sender}</span>
                    )}
                    <span className="message-time">{message.time}</span>
                  </div>
                  <p className="message-text">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
          <InputField />
        </div>
      );
    };
  

export default TextChat;