// // filepath: /d:/Università/Corsi/Magistrale/Secondo Anno/User_Experience_Design/NotAlone_Project/notalone/src/services/dialogflowService.js
// // const dialogflow = require('@google-cloud/dialogflow');
// // const uuid = require('uuid');

// import {dialogFlow} from '@google-cloud/dialogflow';
// import {uuid} from 'uuid';

// const projectId = 'notalone-fwin';
// const sessionId = uuid.v4();
// const sessionClient = new dialogflow.SessionsClient();
// const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

// async function sendMessageToDialogflow(message) {
//   const request = {
//     session: sessionPath,
//     queryInput: {
//       text: {
//         text: message,
//         languageCode: 'it-IT',
//       },
//     },
//   };

//   const responses = await sessionClient.detectIntent(request);
//   return responses[0].queryResult;
// }

// export { sendMessageToDialogflow };

import axios from "axios";

// Chiave di autenticazione presa dal file JSON del Service Account
const DIALOGFLOW_API_KEY = "Bearer notalone-fwin-6462f92dda48.json"; // Sostituisci con il tuo token di accesso.

const sessionId = Math.random().toString(36).substring(7); // Genera un ID sessione unico.

export const sendMessageToDialogflow = async (message) => {
  const url = `https://dialogflow.googleapis.com/v2/projects/notalone-fwin/agent/sessions/${sessionId}:detectIntent`; // Sostituisci [PROJECT_ID] con l'ID del progetto.

  const headers = {
    Authorization: DIALOGFLOW_API_KEY,
    "Content-Type": "application/json",
  };

  const data = {
    queryInput: {
      text: {
        text: message,
        languageCode: "it-IT", // Sostituisci con la lingua desiderata.
      },
    },
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data.queryResult;
  } catch (error) {
    console.error("Errore con Dialogflow:", error);
    throw error;
  }
};