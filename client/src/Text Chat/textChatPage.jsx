import React, { useState } from "react";
import ChatsColumn from "./chatsColumn";
import TextChat from "./messages";
import ChatHeader from "./ChatHeader";
import styles from "./CSS/textChatPage.css";

const TextChatPage = () => {
  const [activeGroupChatId, setActiveGroupChatId] = useState(null);

  return (
    <div className="textChatPageWrapper">
      <div className="leftHandMenu">
        <ChatHeader />
        <ChatsColumn onChatSelect={setActiveGroupChatId} />
      </div>
      <div className="rightHandContainer">
        <TextChat groupchatId={activeGroupChatId} />
      </div>
    </div>
  );
};

export default TextChatPage;
