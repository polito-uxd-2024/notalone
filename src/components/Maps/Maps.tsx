import React from "react";
import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

type LatLng = {
  lat: number;
  lng: number;
};

export default function Maps({ disableSwipe, enableSwipe }) {
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
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
          <Directions />
        </Map>
      </div>
    </APIProvider>
  );
}

function Directions() {
  const map = useMap();

  const routesLibrary = useMapsLibrary ("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes,setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];



  useEffect(() => {
    if(!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
  }, [routesLibrary, map]);

  useEffect(() => {
    if(!directionsService || !directionsRenderer) return;
    directionsService
      .route({
        origin: "Piazza Castello",
        destination: "Piazza Vittorio",
        travelMode: google.maps.TravelMode.WALKING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
      })
  }, [directionsService,directionsRenderer]);

  if(!leg) return null;


  return <div className="direction">
    <h2>{selected.summary}</h2>
  </div>
}
