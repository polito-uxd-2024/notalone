import React, { useEffect, useState } from "react";
import { Col, Button, Image, Row } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

import './SOS.css'

const seconds = 15;
function SOS(props) {
  const { start } = props;
  const [timer, setTimer] = useState(seconds);
  const [callDuration, setCallDuration] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const navigate = useNavigate();
  
  // console.log("Timer: ", timer, " isCancelled: ", isCancelled, " showCall: ", showCall, " start: ", start); 
  
  useEffect(() => {
    if (start && timer > 0 && !isCancelled) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0 && !isCancelled) {
      setShowCall(true); // Show the call component when the timer reaches 0
    }
  }, [timer, isCancelled, start]);

  useEffect(() => {
    if (showCall) {
      const countdown = setTimeout(() => setCallDuration(callDuration + 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [callDuration, showCall]);

  const handleCall = () => {
    setIsCancelled(true);
    setTimer(seconds);
    setCallDuration(0);
    setShowCall(true); // Mostra il componente di chiamata quando viene cliccato il pulsante di chiamata
  };

  const handleCancel = () => {
    setIsCancelled(true);
    setTimer(seconds);
    setIsCancelled(false);
    setShowCall(false);
    console.log("Navigating back...");
    navigate(-1); // Navigate to the previous page
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
    <h1>{formatDuration(callDuration)}</h1>
      <div
        className="sos-112 mb-4"
      />
      <div className="mt-4 justify-content-space-between">
        <Row className="justify-content-center">
          <Col className="call-button" xs="auto">
            <Button className="single-button">
              
            </Button>
            Speaker
          </Col>
          <Col className="call-button" xs="auto">
            <Button className="single-button">
              
            </Button>
            Mute
          </Col>
          <Col className="call-button" xs="auto">
            <Button className="single-button">
            </Button>
            Bluetooth
          </Col>
        </Row>
        <Row className="mt-4 justify-content-center">
          <Button variant="danger" style={{ width: "10vh", height: "10vh", borderRadius: "100%" }} onClick={handleCancel}>
            END
          </Button>
        </Row>
      </div>
    </Col>
  );
}

export { SOS };