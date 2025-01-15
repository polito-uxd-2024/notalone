//todo
// 1. Creare i riquadri in css per utente e Al - FATTO
// 2. riportare la schermata in basso quando diventa troppo lunga
// 3. bloccare message input container in basso - FATTO
// 4. sistemare la chat in modo che i messaggi siano divisi - FATTO
// 5. creare container per i messaggi + container per scrittura messaggio - la chat funziona anche senza container


import React, { useState, useEffect, useRef } from "react";
import './Al.css';


function AlChat() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatBoxRef = useRef(null);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    const newMessage = { sender: 'user', text: message };
    setChatHistory((prevChatHistory) => [...prevChatHistory, newMessage]);

    setMessage(''); //pulisco il messaggio appena viene inviato
    try {
      const res = await fetch('http://localhost:3001/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      const newResponse = { sender: 'bot', text: data.fulfillmentText };
      setChatHistory((prevChatHistory) => [...prevChatHistory, newResponse]);
    } catch (error) {
      console.error('Errore:', error);
    }

  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    }, [chatHistory]);

  return (
    <div className="chat-container">
      <div className="chat-box">
        {chatHistory.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? 'user-message' : 'bot-message'}>
            {msg.text}
          </div>
        ))}
        
      </div>
      <div className="input-box"
       ref={chatBoxRef}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <button onClick={handleSendMessage}>Send</button>
        <div ref={chatBoxRef}></div>
      </div>
    </div>
  );
}

export { AlChat };


