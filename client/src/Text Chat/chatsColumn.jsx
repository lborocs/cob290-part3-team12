import React, { use } from "react";
import ChatWidget from "./chatWidget";
import { useState, useEffect } from "react";
import "./CSS/chatsColumn.css";
import API_URL from "../config";
import EditGroupChatPopup from "./EditGroupChatPopup";
import AddUserPopup from "./AddUserPopup";
import ChatHeader from "./ChatHeader";

const ChatsColumn = ({ onChatSelect }) => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [editingChat, setEditingChat] = useState(null);
  const [addingUserToChat, setAddingUserToChat] = useState(null);

  const fetchChats = () => {
    const jwt = localStorage.getItem("token");
    fetch(`${API_URL}/api/get-groupchats`, {
      method: "GET",
      headers: {
        Authorization: `${jwt}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const text = await response.text();
        return JSON.parse(text);
      })
      .then((data) => {
        setChats(data.groupchats);
      })
      .catch((error) => {
        console.error("Error fetching group chats:", error);
      });
  };

  useEffect(() => {
    // Initial fetch
    fetchChats();

    // Set up polling every 3 seconds
    const pollInterval = setInterval(fetchChats, 3000);

    // Cleanup interval on unmount
    return () => clearInterval(pollInterval);
  }, []);

  const handleClick = (id) => {
    setActiveChat(id);
    onChatSelect(id);
  };

  const handleEdit = (chatId) => {
    const chatToEdit = chats.find((chat) => chat.groupchat_id === chatId);
    if (chatToEdit) {
      setEditingChat(chatToEdit);
    }
  };

  const handleAddUser = (chatId) => {
    setAddingUserToChat(chatId);
  };

  const handleGroupChatUpdated = (updatedData) => {
    setChats(
      chats.map((chat) =>
        chat.groupchat_id === updatedData.groupchat_id
          ? { ...chat, ...updatedData }
          : chat
      )
    );
  };

  const handleDelete = async (chatId) => {
    const jwt = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${API_URL}/api/delete-groupchat/${chatId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: jwt,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setChats(chats.filter((chat) => chat.groupchat_id !== chatId));
        if (activeChat === chatId) {
          setActiveChat(null);
          onChatSelect(null);
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to delete group chat:", errorData);
      }
    } catch (error) {
      console.error("Error deleting group chat:", error);
    }
  };

  return (
    <div className="chatsColumnWrapper">
      <ChatHeader onChatListUpdate={fetchChats} />
      {chats &&
        chats.map((chat) => (
          <ChatWidget
            key={chat.groupchat_id}
            widgetID={chat.groupchat_id}
            iconFilePath={chat.icon_url}
            chatHeading={chat.name}
            lastMessage={chat.description}
            lastMessageTime={chat.last_active}
            notioficationCount={chat.unread_messages_count}
            isActive={activeChat === chat.groupchat_id}
            handleClick={() => handleClick(chat.groupchat_id)}
            permissions={chat.permission}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddUser={handleAddUser}
          />
        ))}
      <EditGroupChatPopup
        isOpen={!!editingChat}
        onClose={() => setEditingChat(null)}
        onGroupChatUpdated={handleGroupChatUpdated}
        groupchatId={editingChat?.groupchat_id}
        initialData={editingChat}
      />
      <AddUserPopup
        isOpen={!!addingUserToChat}
        onClose={() => setAddingUserToChat(null)}
        groupchatId={addingUserToChat}
      />
    </div>
  );
};

export default ChatsColumn;
