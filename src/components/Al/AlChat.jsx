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
import { Skeleton } from 'primereact/skeleton';
        
import alIcon from "/al/al.svg"
// import {sendMessageToDialogflow} from './dialogflowService';
// import { data } from "react-router";



function AlChat({chatHistory, setChatHistory, handleStart, handleSettings, handleLocationChange}) {
  const [agenda, setAgenda] = useState([]);
  const [message, setMessage] = useState('');
  const [isNew, setNew] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(true);
  const chatBoxRef = useRef(null);
  
  async function ReadFromAgendaJSON() {
    try{
      const response = await fetch('/notalone/al/agenda.json');
      const agenda = await response.json();
      return agenda;
    } catch (error) {
      console.log('Errore fetching agenda:', error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: 'bot', text: 'Errore nel recuperare la tua agenda, riprova più tardi' }
      ]);
      return ;  
    }
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
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: 'bot', text:"'Errore nell'aggiornamento dell'agenda, riprova più tardi" }
      ]);
    } 
  }
  
  const welcomeMessage = { 
    id: 1,
    sender: 'bot',
    text: <>Odio questo esame<br/>
         <p className="bot-message">
           <button onClick={() => setMessageToGame()}>Gioco</button> 
           <button onClick={() => setMessageToAgenda()}>Agenda</button>
           <button onClick={() => setMessageToTrivia()}>Trivia</button>
           </p></>
          };

  const newChatMessage = {
    id: 2,
    sender: 'nuova-chat',
    text: 'Nuova Chat'
  };

  const waitBotResposne = {
    id: 3,
    sender: 'bot',
    text: <Skeleton width="8rem" height="2rem" borderRadius="10px"></Skeleton>
  }

  const errorMessages = [
    "Ops! 😅 C'è stato un piccolo imprevisto... dai, riprova fra poco!",
    "Oh no! 😕 Qualcosa non è andato come previsto. Ma niente paura, ce la farò!",
    "Argh! 🛠️ Un piccolo errore nel sistema, ma non temere, sono sempre qui per aiutarti!",
    "Oops, è successo un imprevisto! 🧐 Non preoccuparti, un piccolo bug da risolvere e torniamo subito a funzionare!",
    "Un piccolo ostacolo nel percorso! 🚧 Riprova fra qualche istante, ti prometto che ci siamo!",
    "Hmm... 🤔 Un errore si è infiltrato, ma non c'è nulla che non possa risolvere! Riprova tra un attimo!",
    "Al di fuori dei piani! 😬 Ma niente panico, sono qui per sistemare tutto!",
    "Uh-oh! 😲 C'è stato un piccolo problema, ma non è niente che non possiamo sistemare! Torno subito con una soluzione."
  ];
  

  // GESTIONE recupero dati dal file agenda.json
  useEffect(() => {
    async function fetchAgenda() {
      const agendaString = await ReadFromAgendaJSON();
      setAgenda(agendaString);
    }
    fetchAgenda();
    setChatHistory([welcomeMessage]);
  }, []);

  useEffect(() => {
    let myChatHistory = [...chatHistory]
    console.log(myChatHistory.length)
    if(myChatHistory.length > 0 && myChatHistory[myChatHistory.length - 1].id !== 1) { 
      setChatHistory((prev) => [...prev, newChatMessage, welcomeMessage])
    }
  }, [isNew])


  // function setMessageToGame() { 
  //   const sendMessage = 'Voglio fare un gioco';
  //   handleSendMessage(sendMessage);
  // }

  // function setMessageToAgenda() {
  //   const sendMessage = 'Voglio vedere la mia agenda';
  //   handleSendMessage(sendMessage);
  // }

  // function setMessageToTrivia() {
  //   const sendMessage = 'Raccontami una curiosità';
  //   handleSendMessage(sendMessage);
  // }
  
  function setMessageToGame() { 
    const sendMessage = 'Che ne dici di una sfida? Voglio giocare! 🎮';
    handleSendMessage(sendMessage);
  }

  function setMessageToAgenda() {
      const sendMessage = 'Mi dai un colpo d’occhio sulla mia agenda? 📅';
      handleSendMessage(sendMessage);
  }

  function setMessageToTrivia() {
      const sendMessage = 'Svelami una curiosità che non so! 🤔';
      handleSendMessage(sendMessage);
  }


  function getRandomErrorMessage() {
    const randomIndex = Math.floor(Math.random() * errorMessages.length);
    return errorMessages[randomIndex];
  }
  
  // HANDLE per eliminare il messaggio di benvenuto quando viene selezionato un bottone o inviato un messaggio
  const handleStartingMessage = (idToDelete) => {

    setChatHistory((prev) => prev.filter(msg => msg.id !== idToDelete)); 
  }

  const handleSendMessage = async (msg) => {
    const printAgendaMap = (agendaJson) => {
      return agendaJson.map((event, index) => (<p key={index}>{`• ${event.attività} il ${event.data} alle ${event.ora}`}<br/></p>))
    }
    // console.log(chatHistory);

    // console.log('chathistory length',chatHistory.length, chatHistory);
    const textMessage = msg || message
    if (textMessage.trim() === '') return;
    const newMessage = { sender: 'user', text: textMessage};

    handleStartingMessage(1);
  
    setChatHistory((prevChatHistory) => [...prevChatHistory, newMessage]);
    setMessage(''); // Pulisce il campo di input

    setChatHistory((prevChatHistory) => [...prevChatHistory, waitBotResposne]);
    setLoadingMessage(false);

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
      const myAgenda = [...agenda]
      if (data.fulfillmentText === 'SOS') {
        handleLocationChange(2)
        newResponse.text = 'Non preoccuparti, sto aprendo le informazioni di emergenza per te.'
      } else if (data.fulfillmentText === 'Mappa') {
        handleLocationChange(0)
        newResponse.text = 'Posso aiutarti a trovare il percorso migliore per arrivare a casa. Sto aprendo la mappa per te!'
      }
      if (data.fulfillmentText === "codeShowAgenda") {
        newResponse.text = printAgendaMap(myAgenda)
      } else if (data.fulfillmentText === "codeUpdateEventAgenda") {
        if(myAgenda.findIndex((events) => events.id === "evento4") != -1) {
            const changedEvent = {
              id: 'evento4',
              attività: "New Event Name",
              data: "AAAA-MM-GG",
              ora: "HH:xx"
            };
            myAgenda[myAgenda.findIndex((events) => events.id === "evento4")] = changedEvent;
            const successChange = <>Ecco la tua agenda modificata!<br/></>
            const printAgenda = printAgendaMap(myAgenda);
            newResponse.text = [successChange, ...printAgenda];
          } else {
            const noUpdatableEvent = <>L'evento che stai cercando di modificare non esiste.<br/><br/> Ecco la tua agenda:<br/></>
            const printAgenda = printAgendaMap(myAgenda)
            newResponse.text = [noUpdatableEvent, ...printAgenda];
          }
      } else if (data.fulfillmentText === "codeDeleteAgenda") { 
          if (myAgenda.findIndex((events) => events.id === "evento4") != -1) {
            const updatedAgenda = myAgenda.filter((events) => events.id !== "evento4");
            await AddAgendaEvent(updatedAgenda);
            setAgenda(updatedAgenda);
            const successDeletion = <>Evento cancellato con successo!<br/><br/> Ecco la tua agenda:<br/></>
            const printAgenda = printAgendaMap(updatedAgenda)
            newResponse.text = [successDeletion, ...printAgenda];
          }
          else {
            const alreadyDeleted = <>L'evento è già stato cancellato!<br/><br/> Ecco la tua agenda:<br/></>
            const printAgenda = printAgendaMap(myAgenda)
            newResponse.text = [alreadyDeleted, ...printAgenda];
          }
   
      } else if (data.fulfillmentText === "codeAddAgendaEvent") { 
        const newEvent = {
          id: 'evento4',
          attività: "New Event Name",
          data: "YYYY-MM-DD",
          ora: "HH:mm"
        };
        const newAgenda = [...myAgenda, newEvent]
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
        const newAgenda = [...myAgenda, newEvent]
        await AddAgendaEvent(newAgenda);
        setAgenda(newAgenda);
        const successRestore = <>Ecco ripristinato il tuo evento!<br/><br/></>
        const printAgenda = printAgendaMap(myAgenda)
        newResponse.text = [successRestore, ...printAgenda];  
      }

      //cancella Skeleton prima che invia messaggio bot
      handleStartingMessage(3);
      setLoadingMessage(true);  

      setChatHistory((prevChatHistory) => [...prevChatHistory, newResponse]);
    } catch (error) {
      console.error('Errore:', error);
      handleStartingMessage(3);
      setLoadingMessage(true);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: 'bot', text: getRandomErrorMessage() }
      ]);
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
        setNew((old) => !old)
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
              if (e.key === "Enter" && loadingMessage) handleSendMessage(); }
            }
          />
          <button onClick={() => loadingMessage && handleSendMessage()}>Invia</button>
        </div>
      </div>

      <div className="speed-dial">
        <SpeedDial
        model={actions}
        direction="right"
        showIcon={<img src={alIcon} alt="Custom Icon" style={{ width: '5rem', height: '5rem' }} />}
        style={{ left: '17%', top: 0 }}
        rotateAnimation= {false}
        />
      </div>
    </div>
  );
}

export { AlChat };
