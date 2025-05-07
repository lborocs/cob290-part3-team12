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


    useEffect(() => {
        const jwt = localStorage.getItem("token");
    
        fetch("http://localhost:5000/api//get-groupchats", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            setChats(data);
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