import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

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
  const { start, setStart, handleBack } = props;
  const [timer, setTimer] = useState(seconds);
  const [callDuration, setCallDuration] = useState(0);
  const [showCall, setShowCall] = useState(false);
  
  // console.log("Timer: ", timer, " isCancelled: ", isCancelled, " showCall: ", showCall, " start: ", start); 
  
  useEffect(() => {
    // console.log("SOS useEffect");
    if (start && timer > 0 && !showCall) {
      // console.log("SOS useEffect if");
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0 && !showCall) {
      // console.log("SOS useEffect else");
      setShowCall(true); // Show the call component when the timer reaches 0
    }
  }, [timer, start]);

  useEffect(() => {
    if (showCall) {
      const countdown = setTimeout(() => setCallDuration(callDuration + 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [callDuration, showCall]);

  const handleCall = () => {
    setTimer(seconds);
    setCallDuration(0);
    setShowCall(true); // Mostra il componente di chiamata quando viene cliccato il pulsante di chiamata
  };

  const handleCancel = () => {
    setStart(false);
    setTimer(seconds);
    setShowCall(false);
    handleBack();
    console.log("Navigating back...");
    // navigate(-1); // Navigate to the previous page
    // setTimeout(() => {
    //   window.location.reload(); // Forza l'aggiornamento dello slider
    // }, 100);
  };

  return (
    <>
      {
        showCall ?
        <SOSCall handleCancel={handleCancel} callDuration={callDuration}/>
        :
        <SOSHome handleCancel={handleCancel} timer={timer} handleCall={handleCall}/>
        
      }
    </>
  );
}
function SOSHome(props) {
  return (
    <div className="sos-container">
      <div className="sos-wrapper">
      <div
        className="sos-button"
        onClick={props.handleCall}
      />
      <div className="sos-al">
        <div className="al-home-image-container">
          <img src="al/al_sad.svg" alt="Al" className="al-home-image" style={{height: '4rem', width: '4rem'}} />
        </div>
        <div className="sos-calling-message mt-2 mb-2">
          <h2>Se vuoi allertare i soccorsi premi il pulsante sopra, la chiamata partirà in automatico tra:</h2>
        </div>
      </div>
      <h1 className="sos-timer mt-4">{formatDuration(props.timer)}</h1>
      </div>
      <div className="cancel-button mt-4" onClick={props.handleCancel}>
       <h1> ANNULLA </h1>  
      </div>
    </div>
  );
}
function SOSCall({ handleCancel, callDuration }) {
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMuteOn, setIsMuteOn] = useState(false);
  const [isBluetoothOn, setIsBluetoothOn] = useState(false);

  const toggleSpeaker = () => setIsSpeakerOn(!isSpeakerOn);
  const toggleMute = () => setIsMuteOn(!isMuteOn);
  const toggleBluetooth = () => setIsBluetoothOn(!isBluetoothOn)

  // const formatDuration = (seconds) => {
  //   const hours = Math.floor(seconds / 3600);
  //   const minutes = Math.floor((seconds % 3600) / 60);
  //   const remainingSeconds = seconds % 60;
  
  //   if (hours > 0) {
  //     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  //   } else {
  //     return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  //   }
  // };
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
    <div className="justify-content-center sos-call-bottom-row">
      <div className="mt-4 justify-content-space-between">
        <div className="bottom-row-wrapper">
          <Row className="justify-content-center mb-4">
            <Col className="call-button-wrapper" xs="4">
              <div
                  className={`call-button ${isSpeakerOn ? 'active' : ''}`}
                  onClick={toggleSpeaker}
                >
                <div className="button speaker" />
              </div>
              Speaker
            </Col>
            <Col className="call-button-wrapper" xs="4">
              <div
                className={`call-button ${isMuteOn ? 'active' : ''}`}
                onClick={toggleMute}
              >
                <div className="button mute" />
              </div>
              Mute
            </Col>
            <Col className="call-button-wrapper" xs="4">
              <div
                className={`call-button ${isBluetoothOn ? 'active' : ''}`}
                onClick={toggleBluetooth}
              >
                <div className="button bluetooth" />
              </div>
              Bluetooth
            </Col>
          </Row>
          <Row className="mt-4 justify-content-center">
            <div className="call-button end" onClick={handleCancel}>
              <div className="button endCall"/>
            </div>
          </Row>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}

export { SOS };