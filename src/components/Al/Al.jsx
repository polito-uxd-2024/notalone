import React, { useState } from "react"

import { AlChat } from './AlChat'
import { AlCall } from './AlCall'

function Al(props) {
    const [chatHistory, setChatHistory] = useState([]);
    const [agenda, setAgenda] = useState([
        {
          id: "evento1",
          attività: "Riunione strategica con il team",
          data: "16 Gen 2025",
          ora: "10:00"
        },
        {
          id: "evento2",
          attività: "Allenamento in palestra",
          data: "16 Gen 2025",
          ora: "18:30"
        },
        {
          id: "evento3",
          attività: "Cena conviviale con amici",
          data: "16 Gen 2025",
          ora: "20:00"
        }
      ]);
    const {chatStarted, inCall, handleStart, handleEndCall, handleSettings, handleLocationChange} = props;
    return (
        <>
        {chatStarted?
        (
          inCall?
          <AlCall handleCancel={handleEndCall}/>
          :
          <AlChat chatHistory={chatHistory} setChatHistory={setChatHistory} handleStart={handleStart} handleSettings={handleSettings} handleLocationChange={handleLocationChange} agenda={agenda} setAgenda={setAgenda}/>
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
           <div  className="al-home-image-wrapper"  onClick={() => handleSettings(true)}>
           <img src="al/al.svg" alt="Al" className="al-home-image"/>
            <div className="settings-button">
            <i className="pi pi-cog"></i>
           </div>
          </div>
          </div>
          <div className="al-home-message mt-2">
            <h2>Ciao! Sono Al, il tuo assistente virtuale.<br/> Come posso aiutarti?</h2>
          </div>
          </div>
          <div className="al-home-buttons">
            <div id="chat" className="al-home-button chat" onClick={() => handleStart(true, false)}>
              <div className="icon-wrapper chat-icon"/>
              <label htmlFor="chat">Chat</label>
            </div>
            <div id="call" className="al-home-button call" onClick={() => handleStart(false, true)}>
              <div className="icon-wrapper call-icon"/>
            <label htmlFor="call">Chiamata</label>
              </div>
          </div>
        </div>
        </div>
    )
}

export { Al }