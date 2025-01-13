import React, { useState } from "react";

function AlChat() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSendMessage = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setResponse(data.fulfillmentText);  // Supponendo che la risposta sia in questa forma
    } catch (error) {
      console.error('Errore:', error);
    }
  };

  return (
    <>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <div>
        <p>Response: {response}</p>
      </div>
    </>
  );
}

export {AlChat};