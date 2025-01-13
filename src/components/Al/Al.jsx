import React from 'react';
import { sendMessageToDialogflow } from './dialogflowService';

//function Al() {
        
    //return (
        <>
        </>
    //)
//}

//export { Al }



function Al() {
  const [messages, setMessages] = useState([]);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Web Speech API is not supported by this browser.');
      return;
    }

    const speechRecognition = new window.webkitSpeechRecognition();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = false;
    speechRecognition.lang = 'it-IT';

    speechRecognition.onresult = (event) => {
      const transcript = event.results[event.resultIndex][0].transcript.trim();
      handleUserMessage(transcript);
    };

    setRecognition(speechRecognition);
  }, []);

  const handleUserMessage = async (message) => {
    setMessages([...messages, { text: message, user: true }]);

    const result = await sendMessageToDialogflow(message);
    setMessages([...messages, { text: result.fulfillmentText, user: false }]);
    speak(result.fulfillmentText);
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (recognition) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  return (
    <div>
      <button onClick={startListening}>Start Voice Chat</button>
      <button onClick={stopListening}>Stop Voice Chat</button>
      <div>
        {messages.map((msg, index) => (
          <div key={index} className={msg.user ? 'user-message' : 'bot-message'}>
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export { Al };