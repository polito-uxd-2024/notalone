import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";

export default function Maps({ disableSwipe, enableSwipe }) {
  const [currentPosition, setCurrentPosition] = useState(null); // Stato per la posizione attuale
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Recupera la posizione dell'utente al caricamento del componente
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Errore nel recupero della posizione:", error);
        }
      );
    }
  }, []);

  if (!currentPosition) {
    return (
      <div style={{ height: "80vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Caricamento posizione...</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={"AIzaSyBKdoXYHzSpJ6wc3AGnZVEjef8NYNUACyc"}>
      <div
        style={{ height: "80vh", width: "100%" }}
        onMouseDown={disableSwipe} // Disabilita lo swipe quando il mouse è premuto
        onTouchStart={disableSwipe} // Disabilita lo swipe al tocco
        onMouseUp={enableSwipe} // Riattiva lo swipe quando il mouse viene rilasciato
        onTouchEnd={enableSwipe} // Riattiva lo swipe al termine del tocco
      >
        <Map
          defaultCenter={currentPosition} // Usa la posizione attuale come centro iniziale
          defaultZoom={14} // Zoom iniziale
          mapId={"538ae0fea393aa85"}
          fullscreenControl={false}
          gestureHandling="greedy" // Permette l'interazione con la mappa
        >
          <AdvancedMarker position={currentPosition} onClick={() => setOpen(true)}>
            <Pin background={"grey"} borderColor={"green"} glyphColor={"purple"} />
          </AdvancedMarker>

          {open && (
            <InfoWindow position={currentPosition} onCloseClick={() => setOpen(false)}>
              <p>Sono qui!</p>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
