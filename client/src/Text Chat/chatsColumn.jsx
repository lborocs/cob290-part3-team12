import React, { use } from "react";
// import "./chatsColumn.css";
import ChatWidget from "./chatWidget";
import { useState, useEffect } from "react";
import chatsData from "./../Mock JSON/chats.json";


const ChatsColumn = (

) => {

    const[chats, setChats] = useState([]);

    useEffect(() => {
        setChats(chatsData);
    }, []);

    return (
        <div className="chatsColumnWrapper">
            {chats.map((chat) => (
                <ChatWidget
                    iconFilePath={chat.iconFilePath}
                    chatHeading={chat.chatHeading}
                    lastMessage={chat.lastMessage}
                    lastMessageTime={chat.lastMessageTime}
                    notioficationCount={chat.notioficationCount}
                    />
            ))};
            

            </div>

    );



};

export default ChatsColumn;