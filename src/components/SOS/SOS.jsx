import React, { useEffect, useState } from "react";

import './SOS.css'

const seconds = 1500;

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  } else {
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }
};

function SOS(props) {
  const { handleBack, tab } = props;
  const [showCall, setShowCall] = useState(false);
  
  // console.log("Timer: ", timer, " isCancelled: ", isCancelled, " showCall: ", showCall, " start: ", start); 
  
  const handleCall = () => {
    setShowCall(true); // Mostra il componente di chiamata quando viene cliccato il pulsante di chiamata
  };
  
  const handleCancel = () => {
    setShowCall(false);
    handleBack();
    console.log("Navigating back...");
  };

  return (
    <>
      {
        showCall ?
          <SOSCall handleCancel={handleCancel}/>
          :
          <SOSHome handleCancel={handleCancel} handleCall={handleCall} tab={tab}/>
      }
    </>
  );
}
function SOSHome({handleCancel, tab, handleCall}) {
  return (
    <div className="sos-container">
      <div className="sos-wrapper">
        <div>
          <div className="sos-button-container" onClick={handleCall}>
            <div className="sos-button-wrapper">
              <img src="icons/sos_white.svg" alt="Al" className="sos-button"/>
            </div>
          </div>
          <div className="sos-al">
            <img src="al/al_sad.svg" alt="Al" className="al-home-image"/>
            <div className="sos-calling-message">
            <h2>Se vuoi allertare i soccorsi premi il pulsante sopra, la chiamata partirà tra:</h2>
            </div>
          </div>
        </div>
      {tab==2?
        <Timer handleCall={handleCall}/>
        :
        <h1 className="sos-timer">{formatDuration(15)}</h1>
      }
      </div>
      <div className="button-wrapper">
      <div className="cancel-button" onClick={handleCancel}>
       <h1> ANNULLA </h1>  
      </div>
      </div>
    </div>
  );
}

function Timer({handleCall}) {
  const [timer, setTimer] = useState(seconds)
  useEffect(() => {
    // console.log("SOS useEffect");
    if (timer > 0) {
      // console.log("SOS useEffect if");
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0) {
      // console.log("SOS useEffect else");
      handleCall(); // Show the call component when the timer reaches 0
    }
  }, [timer]);
  
  return (
    <h1 className="sos-timer">{formatDuration(timer)}</h1>
  )
}
function SOSCall({ handleCancel }) {
  const [callDuration, setCallDuration] = useState(0);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMuteOn, setIsMuteOn] = useState(false);
  const [isBluetoothOn, setIsBluetoothOn] = useState(false);

  
  useEffect(() => {
    const countdown = setTimeout(() => setCallDuration(callDuration + 1), 1000);
    return () => clearTimeout(countdown);
  }, [callDuration]);

  const toggleSpeaker = () => setIsSpeakerOn(!isSpeakerOn);
  const toggleMute = () => setIsMuteOn(!isMuteOn);
  const toggleBluetooth = () => setIsBluetoothOn(!isBluetoothOn)
  
  return (
    <div className="sos-container">
    <div className="sos-wrapper">
    <div className="justify-content-center sos-call-top-row">
      <div className="top-row-wrapper">
        <h3>{formatDuration(callDuration)}</h3>
        <div
          className="sos-112 mt-4 mb-4"
        />
      </div>
    </div>
    <div className="justify-content-center call-bottom-row">
      <div className="mt-4 justify-content-space-between">
        <div className="bottom-row-wrapper">
          <div className="grid grid-nogutter justify-content-center mb-4">
            <div className="col-4 call-button-wrapper">
              <div
                  className={`call-button ${isSpeakerOn ? 'active' : ''}`}
                  onClick={toggleSpeaker}
                >
                <div className="button speaker" />
              </div>
              Speaker
            </div>
            <div className="col-4 call-button-wrapper">
              <div
                className={`call-button ${isMuteOn ? 'active' : ''}`}
                onClick={toggleMute}
              >
                <div className="button mute" />
              </div>
              Mute
            </div>
            <div className="col-4 call-button-wrapper">
              <div
                className={`call-button ${isBluetoothOn ? 'active' : ''}`}
                onClick={toggleBluetooth}
              >
                <div className="button bluetooth" />
              </div>
              Bluetooth
            </div>
          <div className="col-4 call-button-wrapper mt-4">
            <div className="call-button end" onClick={handleCancel}>
              <div className="button endCall"/>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}

export { SOS };