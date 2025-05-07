import React, { useState } from 'react';
import './CSS/chatWidget.css';

const chatWidget = (
    {
        widgetID,
        iconFilePath,
        chatHeading,
        lastMessage,
        lastMessageTime,
        notioficationCount,
        isActive,
        handleClick
    }
)=> {

const date = lastMessageTime ? new Date(lastMessageTime) : new Date();
const hours = date.getHours().toString().padStart(2, '0'); 
const minutes = date.getMinutes().toString().padStart(2, '0'); 
const formattedTime = `${hours}:${minutes}`;
var icon = <img src={iconFilePath} alt="icon" />;

if (iconFilePath == null) {
    var initials = chatHeading.split(' ').map((n)=>n[0]).join('');
    icon =<span className='iconInnitials'>{initials}</span>
}

    return (
        <div id = {widgetID}className={`chatWidgetWrapper ${isActive ? 'active' : ''}`} onClick={handleClick}>
            <div className='section iconCol'>
                <div className ='imageMask'>{icon}</div>
            </div>
            <div className ='section contentsCol'>
                <h2 className='chatHeading'>{chatHeading}</h2>
                <p className='lastMessage'>{lastMessage}</p>
                </div>
            <div className='section notificationCol'>
                <p>{formattedTime}</p>
                <div className='notificationCount'>{notioficationCount}</div>
            </div>

        </div>

    
    );
};



export default chatWidget;
