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
// - inserire faccione di Al sopra la chat che apre impostazioni                          FATTO
// - capire e implementare tasto "nuova chat"                                             FATTO
// - implementare spostamento su mappe e SOS (Aurora)
// - dropup menu per chiamata e nuova chat                                                FATTO

import React, { useState, useEffect, useRef } from "react";
import './Al.css';
import { SpeedDial } from "primereact/speeddial";
import alIcon from "/al/al.svg"
// import {sendMessageToDialogflow} from './dialogflowService';
// import { data } from "react-router";

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
    await fetch('https://better-adversely-insect.ngrok-free.app/api/agenda', {
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


function AlChat({chatHistory, setChatHistory, handleStart, handleSettings}) {
  const [agenda, setAgenda] = useState([]);
  const [message, setMessage] = useState('');
  const chatBoxRef = useRef(null);
 

  const welcomeMessage = { 
    id: 1,
    sender: 'bot',
    text: <>Odio questo esame<br/>
         <div className="bot-message">
           <button onClick={() => setMessageToGame()}>Gioco</button> 
           <button onClick={() => setMessageToAgenda()}>Agenda</button>
           <button onClick={() => setMessageToTrivia()}>Trivia</button>
           </div></>
          };
          
  const newChatMessage = {
    sender: 'nuova-chat',
    text: 'nuova Chat'
  };

  // GESTIONE recupero dati dal file agenda.json
  useEffect(() => {
    async function fetchAgenda() {
      const agendaString = await ReadFromAgendaJSON();
      // console.log(agendaString)
      setAgenda(agendaString);
    }
    fetchAgenda();
  }, []);

  
  // GESTIONE PULSANTI sul messaggio di benvenuto
  useEffect(() => {
    setChatHistory( [welcomeMessage]);
  }, []);

  function setMessageToGame() { 
    const sendMessage = 'Voglio fare un gioco';
    handleSendMessage(sendMessage);
  }

  function setMessageToAgenda() {
    const sendMessage = 'Voglio vedere la mia agenda';
    handleSendMessage(sendMessage);
  }

  function setMessageToTrivia() {
    const sendMessage = 'Raccontami una curiosità su Torino';
    handleSendMessage(sendMessage);
  }
  

  // HANDLE per eliminare il messaggio di benvenuto quando viene selezionato un bottone o inviato un messaggio
  const handleStartingMessage = () => {
      // const refinedChatHistory = chatHistory.slice(0, chatHistory.length - 1);
      let refinedChatHistory = chatHistory;
      refinedChatHistory = refinedChatHistory.filter(msg => msg.id !== 1);

      console.log('refined chat history', refinedChatHistory)
      setChatHistory(refinedChatHistory); 
    
  }

  const handleSendMessage = async (msg) => {
    // console.log(chatHistory);

    // console.log('chathistory length',chatHistory.length, chatHistory);
    console.log("msg ", msg)
    console.log("message ", message)
    const textMessage = msg || message
    console.log("textMsg ", textMessage)
    if (textMessage.trim() === '') return;
    const newMessage = { sender: 'user', text: textMessage};
    handleStartingMessage();

    setChatHistory((prevChatHistory) => [...prevChatHistory, newMessage]);
    setMessage(''); // Pulisce il campo di input

    try {
      const res = await fetch('https://better-adversely-insect.ngrok-free.app/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: textMessage }),
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

          if (agenda.findIndex((events) => events.id === "evento4") != -1) {
            const updatedAgenda = agenda.filter((events) => events.id !== "evento4");
            await AddAgendaEvent(updatedAgenda);
            setAgenda(updatedAgenda);
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


  const actions = [
    {
      label: 'Show Agenda',
      icon: 'pi pi-phone',
      command: () => handleStart(true, true)
    },
    {
      label: 'Nuova Chat',
      icon: 'pi pi-plus',
      command: () => {
        handleStartingMessage();
        console.log(chatHistory.length)
        if(chatHistory[chatHistory.length - 1].id !== 1) 
          setChatHistory((prevChatHistory) => [...prevChatHistory, newChatMessage, welcomeMessage]);
        else 
          setChatHistory((prevChatHistory) => [...prevChatHistory, welcomeMessage])
      }
    },
    {
      label: 'Impostazioni',
      icon: 'pi pi-cog',
      command: () => handleSettings(true)
    }
  ];

  return (
    <div className="chat-container">
      <div className="chat-wrapper">
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

      <SpeedDial
      model={actions}
      direction="right"
      showIcon={<img src={alIcon} alt="Custom Icon" style={{ width: '5rem', height: '5rem' }} />}
      style={{ left: '17%', top: 0 }}
      rotateAnimation= {false}
      />
    </div>
  );
}

export { AlChat };
