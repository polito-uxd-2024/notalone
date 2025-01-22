import express from 'express';
import cors from 'cors';
import { SessionsClient } from '@google-cloud/dialogflow';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import * as fs from 'fs/promises';
// import ngrok from '@ngrok/ngrok';

// ngrok http --url=better-adversely-insect.ngrok-free.app 80

const app = express();
// const ngrok = NgrokClient();
const port = 80;

const projectId = 'notalone-fwin';  // Sostituisci con il tuo projectId Dialogflow
const sessionClient = new SessionsClient({
  keyFilename: './config/notalone-fwin-6462f92dda48.json', // Sostituisci con il percorso della tua chiave JSON
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

app.post('/api/agenda', async (req, res) => {
  const newEvent = req.body;

  const filePath = path.join('../', 'public', 'al', 'agenda.json');
  console.log("file: ", filePath)
  try {
    await fs.writeFile(filePath, JSON.stringify(newEvent, null, 2));
    res.send('Evento aggiunto con successo');
  } catch (err) {
    console.error('Errore scrittura file:', err);
    res.status(500).send('Errore scrittura file');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server in ascolto su http://0.0.0.0:${port}`);
  // ngrok.connect(port).then(ngrokUrl => {
  //   console.log(`Ngrok tunnel in: ${ngrokUrl}`);
  // }).catch(err => {
  //   console.log(`Couldn't tunnel ngrok: ${err}`);
  // })
});
