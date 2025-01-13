import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Al } from './Al'

function AlHome(props) {
    const { chatStarted, startChat } = props;
    return (
      <>
        {chatStarted ? (
          <Al />
        ) : (
          <>
            <div>Al Home</div>
            <Link to='al' onClick={() => startChat(true)}>Chat</Link>
          </>
        )}
      </>
    );
  }

export { AlHome }