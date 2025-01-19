//TODO LIST
// - sistemare i messaggi di dialogflow
// - aggiungere agenda in dialogflow                                                      FATT0
// - - upgrade id json: data+ora
// - - aggiunta evento                                                                    FATTO
// - - cancellazione evento                                                               FATTO
// - - modifica evento                                                                    FATTO
// - - recupero dell'errore                                                               FATTO                 
// - aggiungere gui agenda                                                                FATTO
// - aggiungere tasti di inizio chat (invio automatico appena apre chat)
// - finire parte di chat base                                                            FATTO
// - implementare impostazioni (personalità, etc)                                         FATTO (Aurora)    
// - cambiare verso chat                                                                  FATTO                    
// - inserire faccione di Al sopra la chat che apre impostazioni
// - capire e implementare tasto "nuova chat"
// - implementare spostamento su mappe e SOS (definire in call)
// - dropup menu per chiamata e nuova chat

import React, { useState, useEffect, useRef } from "react";
import './Al.css';
import { Button } from 'react-bootstrap';
import {sendMessageToDialogflow} from './dialogflowService';
import { data } from "react-router";

async function ReadFromAgendaJSON() {
  try{
    const response = await fetch('/notalone/al/agenda.json');
    const agenda = await response.json();
    return agenda;
  } catch (error) {
    console.log('Errore fetching agenda:', error);
    return ;  
  }
}

async function UpdateAgenda(UpdatedAgendaEvent) {
   
}

async function AddAgendaEvent(NewAgendaEvent) {
  try {
    // console.log('Aggiungendo in agenda: ', NewAgendaEvent)
    await fetch('http://localhost:3001/api/agenda', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(NewAgendaEvent),
    })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Errore fetch:', error));
  } catch (error) {
    console.log('Errore aggiunta evento:', error);
  } 
}


function AlChat() {
  const [agenda, setAgenda] = useState([]);
  const [dirty, setDirty] = useState(false); //tutte le volte che modifico l'agenda devo mettere setDirty(true)
  const [message, setMessage] = useState('');
  const chatBoxRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);
  

                                                      
  useEffect(() => {
    async function fetchAgenda() {
      const agendaString = await ReadFromAgendaJSON();
      // console.log(agendaString)
      setAgenda(agendaString);
    }
    fetchAgenda();
    setDirty(false);
  }, [dirty]);

  useEffect(() => {
    setChatHistory( [{ 
      sender: 'bot',
      text: <>Odio questo esame<br/>
           <div className="bot-message">
             <button onClick={() => setMessageToGame()}>Gioco</button> 
             <button onClick={setMessageToAgenda}>Agenda</button>
             <button onClick={setMessageToTrivia}>Trivia</button>
             </div></>
            }
      ]);
  }, []);

  function setMessageToGame() { 
    const gameMessage = 'Voglio fare un gioco';
    setMessage(gameMessage);
  }

  useEffect(() => {
    if(message === 'Voglio fare un gioco') {
      handleSendMessage();
    }
  }, [message]);

  function setMessageToAgenda() {
    const gameMessage = 'Voglio vedere la mia agenda';
    setMessage(gameMessage);
  }

  useEffect(() => {
    if(message === 'Voglio vedere la mia agenda') {
      handleSendMessage();
    }
  }, [message]);

  function setMessageToTrivia() {
    const gameMessage = 'Raccontami una curiosità su Torino';
    setMessage(gameMessage);
  }

  useEffect(() => {
    if(message === 'Raccontami una curiosità su Torino') {
      handleSendMessage();
    }
  }, [message]);
  
  

  const handleSendMessage = async () => {
    console.log(message);

    // console.log('chathistory length',chatHistory.length, chatHistory);
    if (message.trim() === '') return;

    if (chatHistory.length === 1) { //cancello newMessage appena viene inviato messaggio di risposta dell'utente, prima che il messaggio dell'utente venga aggiunto in chathistory
      const refinedChatHistory = chatHistory.slice(0, chatHistory.length - 1);
      setChatHistory(refinedChatHistory); 
    }

    const newMessage = { sender: 'user', text: message};
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
      const newResponse = { sender: 'bot', text: data.fulfillmentText, intent: data.intent};
      
      if (data.fulfillmentText === "codeShowAgenda") {
        newResponse.text = agenda.map((event) => (<>{`• ${event.attività} il ${event.data} alle ${event.ora}`}<br/></>
        ));  
      } else if (data.fulfillmentText === "codeUpdateEventAgenda") {


        if(agenda.findIndex((events) => events.id === "evento4") != -1) {
            const changedEvent = {
              id: 'evento4',
              attività: "New Event Name",
              data: "AAAA-MM-GG",
              ora: "HH:xx"
            };
            agenda[agenda.findIndex((events) => events.id === "evento4")] = changedEvent;
            const successChange = <>Ecco la tua agenda modificata!<br/></>
            const printAgenda = agenda.map((event) => (<>{`• ${event.attività} il ${event.data} alle ${event.ora}`}<br/></>));
            newResponse.text = [successChange, ...printAgenda];
          } else {
            const noUpdatableEvent = <>L'evento che stai cercando di modificare non esiste.<br/><br/> Ecco la tua agenda:<br/></>
            const printAgenda = agenda.map((event) => (<>{`• ${event.attività} il ${event.data} alle ${event.ora}`}<br/></>));
            newResponse.text = [noUpdatableEvent, ...printAgenda];
          }


      } else if (data.fulfillmentText === "codeDeleteAgenda") { 
          //versione 1 - hard coded, verrà eliminato uno specifico evento
          // console.log('cercando l\'evento', agenda.filter((events) => events.id === "evento4") );
          // console.log('indice dell evento che cerco', agenda.findIndex((events) => events.id === "evento4") );
          // agenda.splice(agenda.findIndex((events) => events.id === "evento4"), 1);
          // console.log('agenda dopo la cancellazione', agenda);

          if (agenda.findIndex((events) => events.id === "evento4") != -1) {
            agenda.splice(agenda.findIndex((events) => events.id === "evento4"), 1);
            await AddAgendaEvent(agenda);
            setAgenda(agenda);
            const successDeletion = <>Evento cancellato con successo!<br/><br/> Ecco la tua agenda:<br/></>
            const printAgenda = agenda.map((event) => (<>{`• ${event.attività} il ${event.data} alle ${event.ora}`}<br/></>));
            newResponse.text = [successDeletion, ...printAgenda];
          }
          else {
            const alreadyDeleted = <>L'evento è già stato cancellato!<br/><br/> Ecco la tua agenda:<br/></>
            const printAgenda = agenda.map((event) => (<>{`• ${event.attività} il ${event.data} alle ${event.ora}`}<br/></>));
            newResponse.text = [alreadyDeleted, ...printAgenda];
          }
   
      } else if (data.fulfillmentText === "codeAddAgendaEvent") { 
        const newEvent = {
          id: 'evento4',
          attività: "New Event Name",
          data: "YYYY-MM-DD",
          ora: "HH:mm"
        };
        const newAgenda = [...agenda, newEvent]
        await AddAgendaEvent(newAgenda);
        setAgenda(newAgenda);
        // console.log('filtro', agenda.map().filter((id) => id === "evento4") );  
        newResponse.text = newAgenda.map((event) => (<>{`• ${event.attività} il ${event.data} alle ${event.ora}`}<br/></>));
      } else if (data.fulfillmentText === "codeRestoreAgendaEvent") {
        
        //TODO: definire quale evento sarà ripristinato nel copione
        const newEvent = {
          id: 'evento4',
          attività: "New Event Name",
          data: "YYYY-MM-DD",
          ora: "HH:mm"
        };
        const newAgenda = [...agenda, newEvent]
        await AddAgendaEvent(newAgenda);
        setAgenda(newAgenda);
        const successRestore = <>Ecco ripristinato il tuo evento!<br/><br/></>
        const printAgenda =newAgenda.map((event) => (<>{`• ${event.attività} il ${event.data} alle ${event.ora}`}<br/></>));
        newResponse.text = [successRestore, ...printAgenda];  
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
          <div key={index} className={`message ${msg.sender}-message`}>
            <h4>{msg.text}</h4>
          </div>
        ))}
        <div ref={chatBoxRef}></div>
      </div>
      <div className="input-box">
        <input
          type="text"
          value={message}
          onChange={(e) => {setMessage(e.target.value);  }}
          placeholder="Scrivi un messaggio..."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage(); }
          }
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export { AlChat };

