import React, { useState } from "react"

import { AlChat } from './AlChat'

function Al(props) {
    const {chatStarted, startChat} = props;
    return (
        <>
        {chatStarted?
        <AlChat/>
            :
        <AlHome startChat={startChat}/>
        }
        </>
    )
}

function AlHome({startChat}) {
    return (
        <div className="al-home-container">
          <div className="al-home-image-container">
            <img src="al/al.svg" alt="Al" className="al-home-image" />
          </div>
          <div className="al-home-message">
            Ciao, sono Al!
          </div>
          <div className="al-home-buttons">
            <button className="al-home-button" onClick={() => startChat(true)}>Chat</button>
            <button className="al-home-button">Altro</button>
          </div>
        </div>
    )
}

export { Al }