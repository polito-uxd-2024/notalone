//TODO LIST
// - sistemare i messaggi di dialogflow
// - aggiungere agenda in dialogflow
// - aggiungere gui agenda
// - aggiungere tasti di inizio chat (invio automatico appena apre chat)
// - finire parte di chat base - FATTO
// - implementare impostazioni (personalità, etc)
// - inserire faccione di Al sopra la chat
// - capire e implementare tasto "nuova chat"

import React, { useState, useEffect, useRef } from "react";
import './Al.css';
import {sendMessageToDialogflow} from './dialogflowService';

async function ReadFromAgendaJSON() {
  try{
    const response = await fetch('/notalone/al/agenda.json');
    const agenda = await response.json();
    const agendaString = agenda.map((event) => `• ${event.attività} il ${event.data} alle ${event.ora}: ${event.descrizione}\n`);
        
    return (agendaString);
  } catch (error) {
    console.log('Errore fetching agenda:', error);
    return ;
  }
}

async function UpdateAgenda(UpdatedAgendaEvent) {

}

async function DeleteAgendaEvent(DeleteAgendaEvent) {

}

async function AddAgendaEvent(NewAgendaEvent) {
  try{
    const response = await fetch('/notalone/al/agenda.json');
    
  }
}

function AlChat() {
  const [agenda, setAgenda] = useState('');
  const [dirty, setDirty] = useState(false); //tutte le volte che modifico l'agenda devo mettere setDirty(true)

  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatBoxRef = useRef(null);


  useEffect(() => {
    async function fetchAgenda() {
      const agendaString = await ReadFromAgendaJSON();
      setAgenda(agendaString);
    }
    fetchAgenda();
    setDirty(false);
  }, [dirty]);

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
      if (data.fulfillmentText === "codeShowAgenda") {
        newResponse.text = agenda;
        setDirty(true);

      } else if (data.fulfillmentText === "codeUpdateAgenda") { 


      } else if (data.fulfillmentText === "codeDeleteAgenda") { 


      } else if (data.fulfillmentText === "codeAddAgendaEvent") { 


      }


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
