import React, { use } from "react";
// import "./chatsColumn.css";
import ChatWidget from "./chatWidget";
import { useState, useEffect } from "react";
import chatsData from "./../Mock JSON/chats.json";
import "./CSS/chatsColumn.css";

const ChatsColumn = (
) => {
    const[chats, setChats] = useState([]);
    const[activeChat, setActiveChat] = useState(null);
    // useEffect(() => {
    //     setChats(chatsData);
    // }, []);

    useEffect(() => {
        const jwt = localStorage.getItem("token");

        console.log(localStorage.getItem("token"));
        fetch("http://35.234.158.197/api/get-groupchats", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            }
        })
        .then(async (response) => {
            const text = await response.text();
            console.log("Raw response:", text);
            return JSON.parse(text);
          })
        .then(data => {
            setChats(data.groupchats);
            console.log("Fetched group chats:", data);  
        })
        .catch(error => {
            console.error("Error fetching group chats:", error);
        });
    }, []);
    

    const handleClick = (id) => {
        console.log('clicked', id);
        setActiveChat(id);
    }

    return (
        <div className="chatsColumnWrapper">
            {chats.map((chat) => (
                <ChatWidget
                widgetID = {chat.groupchat_id}
                iconFilePath={chat.icon_url}
                chatHeading={chat.chatHeading}
                lastMessage={chat.description}
                lastMessageTime={chat.last_active}
                notioficationCount={chat.unread_messages_count}
                isActive={activeChat === chat.groupchat_id}
                handleClick={() => handleClick(chat.groupchat_id)}
                    />
            ))}
            

            </div>

    );



};

export default ChatsColumn;