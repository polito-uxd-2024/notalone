import React, { useEffect, useState } from "react";
import { Col, Button, Image, Row } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

import './SOS.css'

const seconds = 15;
function SOS(props) {
  const { start } = props;
  const [timer, setTimer] = useState(seconds);
  const [isCancelled, setIsCancelled] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const navigate = useNavigate();
  
  // console.log("Timer: ", timer, " isCancelled: ", isCancelled, " showCall: ", showCall, " start: ", start); 
  
  // useEffect(() => {
  //   if (start && timer > 0 && !isCancelled) {
  //     const countdown = setTimeout(() => setTimer(timer - 1), 1000);
  //     return () => clearTimeout(countdown);
  //   } else if (timer === 0 && !isCancelled) {
  //     setShowCall(true); // Show the call component when the timer reaches 0
  //   }
  // }, [timer, isCancelled, start]);

  const handleCall = () => {
    setIsCancelled(true);
    setTimer(seconds);
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
        <SOSCall handleCancel={handleCancel}/>
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
function SOSCall({ handleCancel }) {
  return (
    <>
      <Image
        style={{ width: "40vh", height: "40vh", border: "5px solid red", borderRadius: "100%" }}
      />
      <div className="mt-4">
        <Row className="justify-content-center">
          <Col xs="auto">
            <Button style={{ width: "10vh", height: "10vh", borderRadius: "100%" }}>
              
            </Button>
          </Col>
          <Col xs="auto">
            <Button style={{ width: "10vh", height: "10vh", borderRadius: "100%" }}>
              
            </Button>
          </Col>
          <Col xs="auto">
            <Button style={{ width: "10vh", height: "10vh", borderRadius: "100%" }}>
            </Button>
          </Col>
        </Row>
        <Row className="mt-4 justify-content-center">
          <Button style={{ width: "10vh", height: "10vh", borderRadius: "100%" }} onClick={handleCancel}>
            END
          </Button>
        </Row>
      </div>
    </>
  );
}

export { SOS };