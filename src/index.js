import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const microphone = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      microphone.current = new window.webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      microphone.current = new window.SpeechRecognition();
    } else {
      alert('Speech Recognition API is not supported in this browser.');
      return;
    }

    microphone.current.continuous = true;
    microphone.current.interimResults = true;
    microphone.current.lang = 'en-US';

    microphone.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript + interimTranscript);
    };

    microphone.current.onerror = (event) => {
      setTranscript(`Error: ${event.error}`);
    };

    return () => {
      if (microphone.current) {
        microphone.current.stop();
        microphone.current = null;
      }
    };
  }, []);

  const startListening = () => {
    if (microphone.current) {
      setTranscript('');
      microphone.current.start();
      setIsRecording(true);
    }
  };

  const stopListening = () => {
    if (microphone.current) {
      microphone.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      <h1>Speech Recognition App</h1>
      <h3>Say something....</h3>
      <div className="noteContainer">
        <h2>Live Transcript</h2>
        <p>{transcript}</p>
      </div>
      <button onClick={startListening} disabled={isRecording}>Start</button>
      <button onClick={stopListening} disabled={!isRecording}>Stop</button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));