import express from 'express';
import cors from 'cors';
import { SessionsClient } from '@google-cloud/dialogflow';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3001;

const projectId = 'notalone-x9eu';  // Sostituisci con il tuo projectId Dialogflow
const sessionClient = new SessionsClient({
  keyFilename: './config/notalone-x9eu-e0a4744da305.json', // Sostituisci con il percorso della tua chiave JSON
});


app.use(cors());

app.use(express.json());

app.post('/api/message', async (req, res) => {
  const sessionId = uuidv4();
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  const { message } = req.body;

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: 'en-US',
      },
    },
  };

  try {
    const [response] = await sessionClient.detectIntent(request);
    res.json(response.queryResult);
  } catch (error) {
    console.error('Errore:', error);
    res.status(500).send('Errore durante la comunicazione con Dialogflow');
  }
});

app.listen(port, () => {
  console.log(`Server in ascolto su http://localhost:${port}`);
});
