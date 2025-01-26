import React, { useState, useEffect } from "react";
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
    <div className="al-call-wrapper">
    <div className="justify-content-center sos-call-top-row">
      <div className="top-row-wrapper">
        <h3>{formatDuration(callDuration)}</h3>
        <div className="al-home-image-container">
          <img src="al/al.svg" alt="Al" className="al-home-image" style={{height: '12rem', width: '12rem'}} />
        </div>
      </div>
    </div>
    <div className="justify-content-center call-bottom-row">
      <div className="justify-content-space-between">
        <div className="bottom-row-wrapper">
        <div className="grid justify-content-center mb-4">
            <div className="col-4 call-button-wrapper">
              <div
                  id="speaker"
                  className={`call-button ${isSpeakerOn ? 'active' : ''}`}
                  onClick={toggleSpeaker}
                >
                <div className="button speaker" />
              </div>
              <label htmlFor="speaker">Speaker</label>
            </div>
            <div className="col-4 call-button-wrapper">
              <div
                id="mute"
                className={`call-button ${isMuteOn ? 'active' : ''}`}
                onClick={toggleMute}
              >
                <div className="button mute" />
              </div>
              <label htmlFor="mute">Mute</label>
            </div>
            <div className="col-4 call-button-wrapper">
              <div
                id='bt'
                className={`call-button ${isBluetoothOn ? 'active' : ''}`}
                onClick={toggleBluetooth}
              >
                <div className="button bluetooth" />
              </div>
              <label htmlFor="bt">Bluetooth</label>
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

export { AlCall };