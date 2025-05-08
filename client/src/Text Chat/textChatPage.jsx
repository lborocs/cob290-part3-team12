import React from "react";
import ChatsColumn from "./chatsColumn";
import TextChat from './messages';
import ChatHeader from "./ChatHeader";
import styles from './CSS/textChatPage.css';

const TextChatPage = () => {

    return (
        <div className="textChatPageWrapper">
            <div className="leftHandMenu">
                <ChatHeader/>
                <ChatsColumn/>
            </div>
            <div className="rightHandContainer">
            <TextChat/>
            </div>
        </div>
    );  

}


export default TextChatPage;