import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import "./Maps.css";


function Maps({ disableSwipe, enableSwipe, handleTabClick }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(null);
  const [isNavigationStarted, setIsNavigationStarted] = useState(false);
  const [destinationCoords, setDestinationCoords] = useState(null);

  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  console.log(key);

  useEffect(() => {
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (!target.closest("input") && !target.closest("[data-suggestions]")) {
        setShowSuggestions(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSetCurrentPosition = (type) => {
    if (currentPosition) {
      if (type === "origin") {
        setOrigin("La mia posizione");
      } else if (type === "destination") {
        setDestination("La mia posizione");
      }
      setShowSuggestions(null);
    }
  };

  const handleInputChange = (e, type) => {
    const value = e.target.value;
    if (type === "origin") {
      setOrigin(value);
    } else {
      setDestination(value);
    }
    if (value) {
      setShowSuggestions(null);
    }
  };

  const renderSuggestions = (type) => {
    const currentInput = type === "origin" ? origin : destination;
    return (
      !currentInput && (
        <div className="suggestions" data-suggestions>
          <p onClick={() => handleSetCurrentPosition(type)}>La mia posizione</p>
        </div>
      )
    );
  };

  const handleStartNavigation = async () => {
    if (!origin || !destination) {
      alert("Inserisci sia l'origine che la destinazione per avviare la navigazione.");
      return;
    }

    setIsNavigationStarted(true);
    setShowPopup(false);

    if (destination) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: destination }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
          const coords = results[0].geometry.location;
          setDestinationCoords({ lat: coords.lat(), lng: coords.lng() });
        } else {
          console.error("Errore nella geocodifica:", status);
        }
      });
    }
  };

  const handleExitNavigation = () => {
    setIsNavigationStarted(false);
    setOrigin("");
    setDestination("");
    setDestinationCoords(null);

    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(null);
  };

  if (!currentPosition) {
    return (
      <div className="loading-container">
        <p>Caricamento posizione...</p>
      </div>
    );
  }

  return (
    <>
    <Button><div onClick={(e) => handleTabClick(e, 2)}>Click</div></Button>
    <APIProvider apiKey={key}>
      <div
        className="map-container"
        onMouseDown={disableSwipe}
        onTouchStart={disableSwipe}
        onMouseUp={enableSwipe}
        onTouchEnd={enableSwipe}
      >
        <Map
          defaultCenter={currentPosition}
          defaultZoom={14}
          mapId={"538ae0fea393aa85"}
          fullscreenControl={false}
          gestureHandling="greedy"
        >
          <AdvancedMarker position={currentPosition}>
            <div className="circle"></div>
          </AdvancedMarker>

          {origin && destination && isNavigationStarted && (
            <Directions
              origin={origin}
              destination={destination}
              currentPosition={currentPosition}
              clearDirections={!isNavigationStarted}
            />
          )}

          {destinationCoords && (
            <AdvancedMarker position={destinationCoords}>
              <div className="flag"></div>
            </AdvancedMarker>
          )}
        </Map>

        {!isNavigationStarted && (
          <div className="search-bar" onClick={() => setShowPopup(true)}>
            <span className="search-text">Cerca un percorso...</span>
          </div>
        )}

        {isNavigationStarted && (
          <div className="exit-button" onClick={handleExitNavigation}>
            <span className="exit-text">X</span>
          </div>
        )}

        {showPopup && !isNavigationStarted && (
          <div className="popup-overlay">
            <div className="popup">
              <h2>Inserisci Percorso</h2>
              <div className="label-container">
                <label>
                  Origine:
                  <div className="input-container">
                    <input
                      type="text"
                      placeholder="Es. Piazza Castello"
                      value={origin || ""}
                      onChange={(e) => handleInputChange(e, "origin")}
                      onFocus={() => setShowSuggestions("origin")}
                    />
                    {origin && (
                      <span className="clear-button" onClick={() => setOrigin("")}>✕</span>
                    )}
                  </div>
                </label>
                {showSuggestions === "origin" && renderSuggestions("origin")}
              </div>

              <div className="label-container">
                <label>
                  Destinazione:
                  <div className="input-container">
                    <input
                      type="text"
                      placeholder="Es. Piazza Vittorio"
                      value={destination || ""}
                      onChange={(e) => handleInputChange(e, "destination")}
                      onFocus={() => setShowSuggestions("destination")}
                    />
                    {destination && (
                      <span className="clear-button" onClick={() => setDestination("")}>✕</span>
                    )}
                  </div>
                </label>
                {showSuggestions === "destination" && renderSuggestions("destination")}
              </div>

              <div className="buttonContainer">
                <button className="close-button" onClick={() => setShowPopup(false)}>Chiudi</button>
                <button className="start-button" onClick={handleStartNavigation}>Avvia</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </APIProvider>

    </>
  );
}

const Directions = ({
  origin,
  destination,
  currentPosition,
  clearDirections,
}) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useStateì(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  useEffect(() => {
    if (!routesLibrary || !map) return;
    const renderer = new routesLibrary.DirectionsRenderer({ map, suppressMarkers: true });
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(renderer);

    return () => {
      renderer.setMap(null);
    };
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    if (!clearDirections) {
      directionsService.route(
        {
          origin: origin === "La mia posizione" ? currentPosition : origin,
          destination: destination === "La mia posizione" ? currentPosition : destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
          } else {
            console.error("Errore nella richiesta di direzioni:", status);
          }
        }
      );
    }
  }, [directionsService, directionsRenderer, clearDirections, origin, destination, currentPosition]);

  return null;
};

export { Maps }