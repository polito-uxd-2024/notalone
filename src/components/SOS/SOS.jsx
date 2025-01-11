import React, { useEffect, useState } from "react";
import { Col, Button, Image, Row } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

import './SOS.css'

const seconds = 15;
function SOS(props) {
  const { start, setStart, showCall, setShowCall } = props;
  const [timer, setTimer] = useState(seconds);
  const [callDuration, setCallDuration] = useState(0);
  // const [showCall, setShowCall] = useState(false);
  const navigate = useNavigate();
  
  // console.log("Timer: ", timer, " isCancelled: ", isCancelled, " showCall: ", showCall, " start: ", start); 
  
  useEffect(() => {
    console.log("SOS useEffect");
    if (start && timer > 0 && !showCall) {
      console.log("SOS useEffect if");
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0 && !showCall) {
      console.log("SOS useEffect else");
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
    // setShowCall(false);
    console.log("Navigating back...");
    navigate(-1); // Navigate to the previous page
    setTimeout(() => {
      window.location.reload(); // Forza l'aggiornamento dello slider
    }, 100);
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
    <Col className="sos-col mt-2">
      <Button
        className="sos-button"
        variant="danger"
        style={{ width: "40vh", height: "40vh", borderRadius: "100%" }}
        onClick={props.handleCall}
      />
      <div className="mt-4">
        <h3>Calling in {props.timer} seconds...</h3>
      </div>
      <Button variant="secondary" className="mt-4" onClick={props.handleCancel}>
        Cancel
      </Button>
    </Col>
  );
}
function SOSCall({ handleCancel, callDuration }) {
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMuteOn, setIsMuteOn] = useState(false);
  const [isBluetoothOn, setIsBluetoothOn] = useState(false);

  const toggleSpeaker = () => setIsSpeakerOn(!isSpeakerOn);
  const toggleMute = () => setIsMuteOn(!isMuteOn);
  const toggleBluetooth = () => setIsBluetoothOn(!isBluetoothOn)

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
  return (
    <Col className="sos-call-col">
    <h3>{formatDuration(callDuration)}</h3>
      <div
        className="sos-112 mb-4"
      />
      <div className="mt-4 justify-content-space-between">
        <Row className="justify-content-center">
          <Col className="call-button-wrapper" xs="auto">
            <Button
                className={`call-button ${isSpeakerOn ? 'active' : ''}`}
                onClick={toggleSpeaker}
              >
              <div className="button speaker" />
            </Button>
            Speaker
          </Col>
          <Col className="call-button-wrapper" xs="auto">
            <Button
              className={`call-button ${isMuteOn ? 'active' : ''}`}
              onClick={toggleMute}
            >
              <div className="button mute" />
            </Button>
            Mute
          </Col>
          <Col className="call-button-wrapper" xs="auto">
            <Button
              className={`call-button ${isBluetoothOn ? 'active' : ''}`}
              onClick={toggleBluetooth}
            >
              <div className="button bluetooth" />
            </Button>
            Bluetooth
          </Col>
        </Row>
        <Row className="mt-4 justify-content-center">
          <Button variant="danger" className="call-button-end" onClick={handleCancel}>
            <div className="button endCall"/>
          </Button>
        </Row>
      </div>
    </Col>
  );
}

export { SOS };