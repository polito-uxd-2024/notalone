import React, { useState } from "react"

import { AlChat } from './AlChat'

function Al(props) {
    const {chatStarted, handleStart} = props;
    return (
        <>
        {chatStarted?
        <AlChat/>
            :
        <AlHome handleStart={handleStart}/>
        }
        </>
    )
}

function AlHome({handleStart}) {
    return (
        <div className="al-home-container">
          <div className="al-home-wrapper">
          <div>
          <div className="al-home-image-container">
            <img src="al/al.svg" alt="Al" className="al-home-image" />
          </div>
          <div className="al-home-message mt-2">
            <h2>Ciao! Sono Al, il tuo assistente virtuale. <br/> Come posso aiutarti?</h2>
          </div>
          </div>
          <div className="al-home-buttons">
            <div className="al-home-button chat" onClick={() => handleStart(true)}><div className="icon-wrapper chat-icon"/></div>
            <div className="al-home-button call"><div className="icon-wrapper call-icon"/></div>
          </div>
        </div>
        </div>
    )
}

export { Al }