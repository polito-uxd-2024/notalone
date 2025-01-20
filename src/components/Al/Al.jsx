import React, { useState } from "react"

import { AlChat } from './AlChat'
import { AlCall } from './AlCall'

function Al(props) {
    const [chatHistory, setChatHistory] = useState([]);
    const {chatStarted, inCall, handleStart, handleEndCall, handleSettings} = props;
    return (
        <>
        {chatStarted?
        (
          inCall?
          <AlCall handleCancel={handleEndCall}/>
          :
          <AlChat chatHistory={chatHistory} setChatHistory={setChatHistory} handleStart={handleStart} handleSettings={handleSettings}/>
        )
            :
        (
          inCall?
          <AlCall handleCancel={handleEndCall}/>
          :
          <AlHome handleStart={handleStart} handleSettings={handleSettings}/>
        )
       
        }
        </>
    )
}

function AlHome({handleStart, handleSettings}) {
    return (
        <div className="al-container">
          <div className="al-wrapper">
          <div>
          <div className="al-home-image-container">
            <img src="al/al.svg" alt="Al" className="al-home-image" onClick={() => handleSettings(true)}/>
          </div>
          <div className="al-home-message mt-2">
            <h2>Ciao! Sono Al, il tuo assistente virtuale. <br/> Come posso aiutarti?</h2>
          </div>
          </div>
          <div className="al-home-buttons">
            <div className="al-home-button chat" onClick={() => handleStart(true, false)}><div className="icon-wrapper chat-icon"/></div>
            <div className="al-home-button call" onClick={() => handleStart(false, true)}><div className="icon-wrapper call-icon"/></div>
          </div>
        </div>
        </div>
    )
}

export { Al }