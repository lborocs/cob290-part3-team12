import React from "react";
import ChatsColumn from "./chatsColumn";
import TextChat from './messages';
import styles from './textChatPage.css';

const TextChatPage = () => {



    return (
        <div className="pageWrapper">
            <div className="leftHandMenu">
                <ChatsColumn/>
            </div>
            <div className="chatContainer">
            <TextChat/>
            </div>
        </div>
    );  
 
}


export default TextChatPage;