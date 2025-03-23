import React, { useState } from 'react';
import './chatWidget.css';

const chatWidget = (
    {
        iconFilePath,
        chatHeading,
        lastMessage,
        lastMessageTime,
        notioficationCount,
    }
)=> {

    function handleClick() {
        console.log('Clicked');
    }

    return (
        <div className='chatWidgetWrapper' onClick={handleClick}>
            <div className='section iconCol'>
                <div className ='imageMask'><img src ={iconFilePath} alt='icon'/></div>
                {/* <div className ='imageMask'><img alt='icon'/></div> */}
            </div>
            <div className ='section contentsCol'>
                <h2>{chatHeading}</h2>
                <p>{lastMessage}</p>
                </div>
            <div className='section notificationCol'>
                <p>{lastMessageTime}</p>
                <div className='notificationCount'>{notioficationCount}</div>
            </div>

        </div>

    
    );
};



export default chatWidget;
