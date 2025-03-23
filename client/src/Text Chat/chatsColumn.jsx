import React, { use } from "react";
// import "./chatsColumn.css";
import ChatWidget from "./chatWidget";
import { useState, useEffect } from "react";
import chatsData from "./../Mock JSON/chats.json";
import "./chatsColumn.css";


const ChatsColumn = (

) => {

    const[chats, setChats] = useState([]);
    const[activeChat, setActiveChat] = useState(null);


    useEffect(() => {
        setChats(chatsData);
    }, []);

    const handleClick = (id) => {
        console.log('clicked', id);
        setActiveChat(id);
    }

    return (
        <div className="chatsColumnWrapper">
            {chats.map((chat) => (
                <ChatWidget
                    widgetID = {chat.widgetID}
                    iconFilePath={chat.iconFilePath}
                    chatHeading={chat.chatHeading}
                    lastMessage={chat.lastMessage}
                    lastMessageTime={chat.lastMessageTime}
                    notioficationCount={chat.notioficationCount}
                    isActive={activeChat === chat.widgetID}
                    handleClick={() => handleClick(chat.widgetID)}

                    />
            ))}
            

            </div>

    );



};

export default ChatsColumn;