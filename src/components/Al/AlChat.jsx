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
    setMessage(''); // Pulisce il campo di input

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
          <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
            <h4>{msg.text}</h4>
          </div>
        ))}
        <div ref={chatBoxRef}></div>
      </div>
      <div className="input-box">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Scrivi un messaggio..."
          onKeyDown={(e) => {
          if (e.key === "Enter") handleSendMessage();
          }}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export { AlChat };


// return (
//   <div className="chat-wrapper">
//     <div className="chat-container">
//       <div className="chat-box">
//         {chatHistory.map((msg, index) => (
//           <div
//             key={index}
//             className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
//           >
//             <h4>{msg.text}</h4>
//           </div>
//         ))}
//         <div ref={chatBoxRef}></div>
//       </div>
//     </div>
//     <div className="input-box">
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Scrivi un messaggio..."
//         onKeyDown={(e) => {
//           if (e.key === "Enter") handleSendMessage();
//         }}
//       />
//       <button onClick={handleSendMessage}>Invia</button>
//     </div>
//   </div>
// );
// }
