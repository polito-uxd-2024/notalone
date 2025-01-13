// filepath: /d:/Università/Corsi/Magistrale/Secondo Anno/User_Experience_Design/NotAlone_Project/notalone/src/services/dialogflowService.js
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

const projectId = 'notalone-x9eu';
const sessionId = uuid.v4();
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

async function sendMessageToDialogflow(message) {
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: 'en-US',
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  return responses[0].queryResult;
}

module.exports = { sendMessageToDialogflow };