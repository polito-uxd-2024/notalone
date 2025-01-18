import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import './Al.css';

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

function AlCall({handleCancel}) {
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
    <div className="al-container">
    <div className="al-wrapper">
    <div className="justify-content-center sos-call-top-row">
      <div className="top-row-wrapper">
        <h3>{formatDuration(callDuration)}</h3>
        <div className="al-home-image-container">
          <img src="al/al.svg" alt="Al" className="al-home-image" style={{height: '12rem', width: '12rem'}} />
        </div>
      </div>
    </div>
    <div className="justify-content-center call-bottom-row">
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
            <div className="call-button end" onClick={() => handleCancel(false)}>
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

export { AlCall };