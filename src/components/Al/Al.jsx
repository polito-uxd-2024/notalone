import React, { useState } from "react";
import './Al.css';

// function Al() {
//   const [message, setMessage] = useState('');
//   const [response, setResponse] = useState('');

//   const handleSendMessage = async () => {
//     try {
//       const res = await fetch('http://localhost:3001/api/message', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message }),
//       });
//       const data = await res.json();
//       setResponse(data.fulfillmentText);  // Supponendo che la risposta sia in questa forma
//     } catch (error) {
//       console.error('Errore:', error);
//     }
//   };

//   return (
//     <>
//       <div>
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button onClick={handleSendMessage}>Send</button>
//       </div>
//       <div>
//         <p>Response: {response}</p>
//       </div>
//     </>
//   );
// }

// export {Al};


function Al() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    const newMessage = { sender: 'user', text: message };
    setChatHistory((prevChatHistory) => [...prevChatHistory, newMessage]);

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

    setMessage('');
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {chatHistory.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? 'user-message' : 'bot-message'}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export { Al };