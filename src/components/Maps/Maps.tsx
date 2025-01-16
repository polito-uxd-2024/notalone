import React, { useState, useEffect } from "react";
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

export default function Maps({ disableSwipe, enableSwipe }: { disableSwipe: () => void; enableSwipe: () => void }) {
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const [showPopup, setShowPopup] = useState(false); // Controlla se il popup è visibile
  const [origin, setOrigin] = useState<string | null>(""); // Campo per l'origine
  const [destination, setDestination] = useState<string | null>(""); // Campo per la destinazione
  const [showSuggestions, setShowSuggestions] = useState<"origin" | "destination" | null>(null);
  const [isNavigationStarted, setIsNavigationStarted] = useState(false); // Stato per gestire la navigazione
  const [destinationCoords, setDestinationCoords] = useState<LatLng | null>(null); // Stato per memorizzare le coordinate della destinazione

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
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Verifica se il clic non riguarda gli input o i suggerimenti
      if (
        !target.closest("input") && // Clic al di fuori degli input
        !target.closest("[data-suggestions]") // Clic al di fuori dei suggerimenti
      ) {
        setShowSuggestions(null); // Chiude i suggerimenti
      }
    };
  
    document.addEventListener("click", handleClickOutside);
  
    // Cleanup del listener quando il componente viene smontato
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);


  const handleSetCurrentPosition = (type: "origin" | "destination") => {
    if (currentPosition) {
      const pos = `${currentPosition.lat}, ${currentPosition.lng}`;
      if (type === "origin") {
        setOrigin("La mia posizione");
      } else if (type === "destination") {
        setDestination("La mia posizione");
      }
      setShowSuggestions(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: "origin" | "destination") => {
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

  const renderSuggestions = (type: "origin" | "destination") => {
    const currentInput = type === "origin" ? origin : destination;
    return (
      !currentInput && (
        <div style={styles.suggestions} data-suggestions>
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
  
    setIsNavigationStarted(true); // Inizia la navigazione
    setShowPopup(false); // Chiudi il popup
  
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
    setIsNavigationStarted(false); // Termina la navigazione
    setOrigin(""); // Cancella l'origine
    setDestination(""); // Cancella la destinazione
    setDestinationCoords(null); // Cancella le coordinate della destinazione

    // Resetta il percorso visualizzato
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(null); // Rimuove il percorso dalla mappa
  };
  

  if (!currentPosition) {
    return (
      <div
        style={{
          height: "80vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Caricamento posizione...</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={"Key"}>
      <div
        style={{ height: "80vh", width: "100%" }}
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
            <div style={styles.circle}></div>
          </AdvancedMarker>

          {origin && destination && isNavigationStarted && (
            <Directions
              origin={origin}
              destination={destination}
              currentPosition={currentPosition}
              clearDirections={!isNavigationStarted} // Passa true se vogliamo rimuovere il percorso
            />
          )}

          {/* Aggiungi il marker sulla destinazione */}
          {destinationCoords && (
            <AdvancedMarker position={destinationCoords}>
              <div style={styles.flag}></div>
            </AdvancedMarker>
          )}
        </Map>

        {/* Barra di ricerca */}
        {!isNavigationStarted && (
          <div style={styles.searchBar} onClick={() => setShowPopup(true)}>
            <span style={styles.searchText}>Cerca un percorso...</span>
          </div>
        )}

        {/* Bottone di uscita dalla navigazione */}
        {isNavigationStarted && (
          <div
            style={styles.exitButton}
            onClick={handleExitNavigation}
          >
            <span style={styles.exitText}>X</span>
          </div>
        )}

        {/* Popup modale per l'inserimento */}
        {showPopup && !isNavigationStarted && (
          <div style={styles.popupOverlay}>
            <div style={styles.popup}>
              <h2>Inserisci Percorso</h2>
              {/* Origine */}
              <div style={styles.labelContainer}>
                <label>
                  Origine:
                  <div style={styles.inputContainer}>
                    <input
                      type="text"
                      placeholder="Es. Piazza Castello"
                      value={origin || ""}
                      onChange={(e) => handleInputChange(e, "origin")}
                      onFocus={() => setShowSuggestions("origin")}
                    />
                    {origin && (
                      <span style={styles.clearButton} onClick={() => setOrigin("")}>
                        ✕
                      </span>
                    )}
                  </div>
                </label>
                {showSuggestions === "origin" && renderSuggestions("origin")}
              </div>

              {/* Destinazione */}
              <div style={styles.labelContainer}>
                <label>
                  Destinazione:
                  <div style={styles.inputContainer}>
                    <input
                      type="text"
                      placeholder="Es. Piazza Vittorio"
                      value={destination || ""}
                      onChange={(e) => handleInputChange(e, "destination")}
                      onFocus={() => setShowSuggestions("destination")}
                    />
                    {destination && (
                      <span style={styles.clearButton} onClick={() => setDestination("")}>
                        ✕
                      </span>
                    )}
                  </div>
                </label>
                {showSuggestions === "destination" && renderSuggestions("destination")}
              </div>
              <div style={styles.buttonContainer}>
                <button style={styles.closeButton} onClick={() => setShowPopup(false)}>Chiudi</button>
                <button style={styles.startButton} onClick={handleStartNavigation}>Avvia</button>
              </div>

            </div>
          </div>
        )}
      </div>
    </APIProvider>
  );
}

const Directions = ({
  origin,
  destination,
  currentPosition,
  clearDirections,
}: {
  origin: string;
  destination: string;
  currentPosition: LatLng;
  clearDirections: boolean;
}) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!routesLibrary || !map) return;
    const renderer = new routesLibrary.DirectionsRenderer({ map, suppressMarkers: true });
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(renderer);

    // Cleanup quando il componente viene smontato
    return () => {
      renderer.setMap(null);
    };
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    if (clearDirections) {
      directionsRenderer.setMap(null); // Rimuove il percorso dalla mappa
      return;
    }

    const originPosition = origin === "La mia posizione" ? `${currentPosition.lat}, ${currentPosition.lng}` : origin;
    const destinationPosition = destination === "La mia posizione" ? `${currentPosition.lat}, ${currentPosition.lng}` : destination;

    directionsService
      .route({
        origin: originPosition,
        destination: destinationPosition,
        travelMode: google.maps.TravelMode.WALKING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
      .catch((err) => console.error("Errore Directions:", err));
  }, [directionsService, directionsRenderer, origin, destination, currentPosition, clearDirections]);

  return null;
};


const styles = {
  searchBar: {
    position: "absolute" as const,
    bottom: 40,
    left: "45%",
    transform: "translateX(-50%)",
    width: "70%",
    height: "40px",
    background: "#fff",
    borderRadius: "20px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  searchText: {
    color: "#888",
    fontSize: "16px",
  },
  circle: {
    width: '25px',
    height: '25px',
    backgroundColor: 'blue',
    borderRadius: '50%',
    border: '4px solid white',
    boxShadow: '0 0 5px rgba(0,0,0,0.3)',
  },
  popupOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  popup: {
    width: "300px",
    background: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center" as const,
  },
  labelContainer: {
    marginBottom: "15px",
    position: "relative" as const,
  },
  inputContainer: {
    position: "relative" as const,
  },
  clearButton: {
    position: "absolute" as const,
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#aaa",
    cursor: "pointer",
  },
  suggestions: {
    position: "absolute" as const,
    top: "100%",
    left: 0,
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "4px",
    width: "100%",
    zIndex: 10,
  },
  flag: {
    position: "absolute" as const,
    top: "50%",  // Aggiungi le posizioni necessarie
    left: "50%", // Centra l'immagine
    transform: "translate(-50%, -50%)", // Centra l'immagine
    width: "30px",  // Puoi definire le dimensioni
    height: "30px",  // Puoi definire le dimensioni
    backgroundImage: "url('/notalone/FlagDest.png')", // Imposta l'immagine SVG come background
    backgroundSize: "contain", // Rende l'immagine adattabile alle dimensioni
    backgroundRepeat: "no-repeat", // Evita che l'immagine si ripeta
    backgroundPosition: "center", // Posiziona l'immagine al centro
  },
   exitButton: {
    position: "absolute" as const,
    bottom: 40,
    left: 30,
    backgroundColor: "rgba(228, 34, 34, 0.9)",
    borderRadius: "50%",
    width: "50px", // Larghezza maggiore per rendere il pulsante più grande
    height: "50px", // Altezza maggiore per un pulsante perfettamente circolare
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  exitText: {
    fontSize: "32px", // Testo più grande per la "X"
    color: "white",
    fontWeight: "bold",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between", // Distribuisce i pulsanti a sinistra e a destra
    marginTop: "20px", // Aggiungi un po' di spazio sopra i pulsanti
  },
  closeButton: {
    background: "#f8d7da", // Colore di sfondo per il pulsante "Chiudi"
    color: "#721c24", // Colore del testo per il pulsante "Chiudi"
    border: "none",
    borderRadius: "4px",
    padding: "10px 20px",
    cursor: "pointer",
  },
  startButton: {
    background: "#d4edda", // Colore di sfondo per il pulsante "Avvia"
    color: "#155724", // Colore del testo per il pulsante "Avvia"
    border: "none",
    borderRadius: "4px",
    padding: "10px 20px",
    cursor: "pointer",
  }  
};
