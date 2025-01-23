import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { Message } from 'primereact/message';

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  useMapsLibrary
} from "@vis.gl/react-google-maps";

type LatLng = {
  lat: number;
  lng: number;
};

//const HOME_COORDS: LatLng = { lat: 45.073529, lng: 7.669068 }; // Piazza Statuto, Torino

export default function Maps({ disableSwipe, enableSwipe, handleTabClick, homeAddress }: { disableSwipe: () => void; enableSwipe: () => void; handleTabClick: (e, index) => void; homeAddress }) {
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const [showPopup, setShowPopup] = useState(false); // Controlla se il popup è visibile
  const [origin, setOrigin] = useState<string | null>(""); // Campo per l'origine
  const [destination, setDestination] = useState<string | null>(""); // Campo per la destinazione
  const [showSuggestions, setShowSuggestions] = useState<"origin" | "destination" | null>(null);
  const [isNavigationStarted, setIsNavigationStarted] = useState(false); // Stato per gestire la navigazione
  const [isStandard, setIsStandard] = useState(false); //Stato per gestire se è un percorso precaricato o no
  const [isFlagHome, setIsFlagHome] = useState(false);
  const [isFlagGeneric, setIsFlagGeneric] = useState(false);
  const [inputAlert, setInputAlert] = useState(false);
  const [destinationCoords, setDestinationCoords] = useState<LatLng | null>(null); // Stato per memorizzare le coordinate della destinazione
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isSingleTouch, setIsSingleTouch] = useState(true); // Stato per rilevare il tocco singolo
  const mapRef = useRef(null);
  let color = "";
  const [homeCoords, setHomeCoords] = useState<LatLng | null>(null); // Stato per l'indirizzo di casa
  const isHomeInitialized = useRef(false); // Riferimento per verificare l'inizializzazione
  const [steps, setSteps] = useState<google.maps.DirectionsStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const stripHtml = (html: string) => html.replace(/<\/?[^>]+(>|$)/g, "");
  const red = "#FF0000";
  const green = "#00FF00";
  const yellow = "#FFA500";
  const content = (
    <div className="flex align-items-center">
        <img alt="logo" src="/notalone/al_triste.svg" width="42" />
        <div className="ml-2"><strong>Inserisci sia origine che destinazione</strong></div>
    </div>
);

  

  const routes = [
    { origin: { lat: 45.06425923889428, lng: 7.680061063181322 }, destination: { lat: 45.06651966945078, lng: 7.681691535464589 }, color:"green" },
    { origin: { lat: 45.06376732250932, lng: 7.6765451058318845 }, destination: { lat: 45.07059580780062, lng: 7.6815604047878505 }, color:"green" }, //via arsenale
    { origin: { lat: 45.07031545940262, lng: 7.677987756497011 }, destination: { lat: 45.070780582129295, lng: 7.684113585258326 }, color:"green" }, //via pietro micca
    { origin: { lat: 45.070780582129295, lng: 7.684086519740971 }, destination: { lat: 45.06405756328069, lng: 7.6966080144535045 }, color:"green" }, //via po 
    { origin: { lat: 45.07047140583079, lng: 7.686947967909117 }, destination: { lat: 45.06645421453456, lng: 7.6975225428498755 }, color:"green" }, //verdi
    { origin: { lat: 45.07032575770712, lng: 7.686865685316187 }, destination: { lat: 45.07115023623296, lng: 7.687484487467262 }, color:"green" }, //p.za castello vicino po
    { origin: { lat: 45.07003523795949, lng: 7.687300621725626 }, destination: { lat: 45.06906037463699, lng: 7.6865743636766055 }, color:"green" }, //via carlo alb.
    { origin: { lat: 45.069430014888134, lng: 7.688270213448517 }, destination: { lat: 45.06346688383751, lng: 7.684072565867011 }, color:"green" }, // via bogino
    { origin: { lat: 45.062075, lng: 7.679031 }, destination: { lat: 45.066590, lng: 7.684045 }, color: "yellow" }, // Via Carlo Alberto (parallela a Via Roma)
    { origin: { lat: 45.063250, lng: 7.678954 }, destination: { lat: 45.06333739104712, lng: 7.680828066318909 }, color: "red" }, // Piazza Carlo Felici
    { origin: { lat: 45.065457, lng: 7.682293 }, destination: { lat: 45.065913, lng: 7.683832 }, color: "green" }, // Via Cesare Battisti
    { origin: { lat: 45.070020, lng: 7.686420 }, destination: { lat: 45.068284, lng: 7.695000 }, color: "green" }, // Via San Massimo (tra Via Po e Via Verdi)
    { origin: { lat: 45.068880, lng: 7.681660 }, destination: { lat: 45.070300, lng: 7.682350 }, color: "green" }, // Via San Tommaso
    { origin: { lat: 45.069780, lng: 7.690900 }, destination: { lat: 45.070470, lng: 7.694500 }, color: "green" }, // Via San Francesco da Paola
    { origin: { lat: 45.068940, lng: 7.692000 }, destination: { lat: 45.070050, lng: 7.693300 }, color: "green" }, // Via Roero di Cortanze
    { origin: { lat: 45.071000, lng: 7.681210 }, destination: { lat: 45.071490, lng: 7.678020 }, color: "green" },  // Via Stampatori (piccola via tra Garibaldi e Bertola)
    { origin: { lat: 45.067540, lng: 7.678800 }, destination: { lat: 45.070220, lng: 7.678000 }, color: "green" }, // Via Santa Teresa (da Porta Nuova verso Piazza Solferino)
    { origin: { lat: 45.068000, lng: 7.682000 }, destination: { lat: 45.069870, lng: 7.685650 }, color: "green" }, // Via Accademia delle Scienze (collegamento tra via Lagrange e via Po)
    { origin: { lat: 45.065370, lng: 7.682020 }, destination: { lat: 45.067900, lng: 7.680600 }, color: "green" }, //piazza CLN
    { origin: { lat: 45.074900, lng: 7.677540 }, destination: { lat: 45.072800, lng: 7.672800 }, color: "green" }, // Via Carlo Ignazio Giulio (tra via Garibaldi e Corso Valdocco)
    { origin: { lat: 45.072400, lng: 7.678400 }, destination: { lat: 45.073200, lng: 7.675200 }, color: "green" }, // Via delle Orfane (tra via Garibaldi e via Bligny)
    { origin: { lat: 45.07114457024932, lng: 7.68750553952927 }, destination: { lat: 45.07252832286494, lng: 7.6915223138916575 }, color: "yellow" }, //Viale 1o Maggio
    { origin: { lat: 45.068400, lng: 7.681500 }, destination: { lat: 45.06647583849104, lng: 7.690955872844675 }, color: "green" }, // Via Principe Amedeo (alta)
    { origin: { lat: 45.06647583849104, lng: 7.690955872844675 }, destination: { lat: 45.065542596471836, lng: 7.693361155424747 }, color: "yellow" }, // Via Principe Amedeo (bassa) 
    { origin: { lat: 45.063609335916595, lng: 7.691738826770745 }, destination: { lat: 45.064800, lng: 7.694100 }, color: "yellow" }, // Via Giovanni Plana
    { origin: { lat: 45.067700, lng: 7.685200 }, destination: { lat: 45.06587330403804, lng: 7.688606590332282 }, color: "green" }, // Via Maria VIttoria
    { origin: { lat: 45.06587330403804, lng: 7.688606590332282 }, destination: { lat: 45.062908515425576, lng: 7.686512886641768 }, color: "yellow" }, // Via Accademia Albertina (alta)
    { origin: { lat: 45.062908515425576, lng: 7.686512886641768 }, destination: { lat: 45.060728293479166, lng: 7.685017151863959 }, color: "green" }, // Via Accademia Albertina (bassa)
    { origin: { lat: 45.065300, lng: 7.693000 }, destination: { lat: 45.06294479675814, lng: 7.698257832857506 }, color: "green" }, // Piazza Vittorio e ponte
    { origin: { lat: 45.069423585995295, lng: 7.69313411481291 }, destination: { lat: 45.06445752288618, lng: 7.68945805250811 }, color: "green" }, // Via San Massimo (alta)
    { origin: { lat: 45.06445752288618, lng: 7.68945805250811 }, destination: { lat: 45.060244058969566, lng: 7.686335961223492 }, color: "yellow" }, // Via San Massimo (bassa)
    { origin: { lat: 45.06387387402265, lng: 7.6909673082498475 }, destination: { lat: 45.06182778538818, lng: 7.689454542467849 }, color: "yellow" }, // Via Fratelli Calandra (alta)
    { origin: { lat: 45.06182778538818, lng: 7.689454542467849 }, destination: { lat: 45.059712347436644, lng: 7.687953366345828 }, color: "green" }, // Via Fratelli Calandra (bassa)
    { origin: { lat: 45.0651865900825, lng: 7.679189000284278 }, destination: { lat: 45.06073578028304, lng: 7.6925687383963135 }, color: "yellow" }, // Via Gramsci
    { origin: { lat: 45.0655071140731, lng: 7.68242416553966 }, destination: { lat: 45.06246376082689, lng: 7.6802286312793155 }, color: "yellow" }, // Via Lagrange
    { origin: { lat: 45.062831141972296, lng: 7.679036153661025 }, destination: { lat: 45.05712693096317, lng: 7.676870802088124 }, color: "red" }, // Via Nizza (Porta Nuova - Marconi)
    { origin: { lat: 45.05711836584327, lng: 7.676867909722052 }, destination: { lat: 45.05157448173814, lng: 7.674700672659145 }, color:"yellow" }, // Via Nizza (Marconi - Nizza)
    { origin: { lat: 45.0622269456164, lng: 7.677000494966354 }, destination: { lat: 45.05923396900839, lng: 7.67481025774954 }, color:"yellow" }, // Via Sacchi
    { origin: { lat: 45.06113949563227, lng: 7.683919867185215 }, destination: { lat: 45.06882122964909, lng: 7.689182098388869 }, color:"green" }, // Via San Francesco da Paola
    { origin: { lat: 45.06393702652251, lng: 7.681283434016729 }, destination: { lat: 45.06262551870889, lng: 7.684948401901105 }, color:"green" }, // Via Mazzini (alta)
    { origin: { lat: 45.06262551870889, lng: 7.684948401901105 }, destination: { lat: 45.06004761939395, lng: 7.692045725493107 }, color:"yellow" }, // Via Mazzini (bassa)
    { origin: { lat: 45.062167651135056, lng: 7.680079410605161 }, destination: { lat: 45.059432897510106, lng: 7.687636987318146 }, color:"green" }, // Corso Vittorio (lato dx, alto sopo P.Nuova)
    { origin: { lat: 45.059432897510106, lng: 7.687636987318146 }, destination: { lat: 45.058440723280945, lng: 7.690539524565638 }, color:"red" }, // Corso Vittorio (lato dx, basso)
    { origin: { lat: 45.06697114043511, lng: 7.682510165794057 }, destination: { lat: 45.063602327601274, lng: 7.691707576771739 }, color:"green" }, // Via Giolitti (alta)
    { origin: { lat: 45.063602327601274, lng: 7.691707576771739 }, destination: { lat: 45.06250350610754, lng: 7.694727743900208 }, color:"yellow" }, // Via Giolitti (bassa)
    { origin: { lat: 45.06558449064531, lng: 7.698688444338589 }, destination: { lat: 45.061436540318255, lng: 7.693164126300632 }, color:"yellow" }, // Lungo Po (alto)
    { origin: { lat: 45.061436540318255, lng: 7.693164126300632 }, destination: { lat: 45.058500021373526, lng: 7.690771461742876}, color:"red" }, // Lungo Po (basso, Valentino)
    { origin: { lat: 45.066360570985424, lng: 7.680013029225598 }, destination: { lat: 45.063790175987876, lng: 7.687128125237991}, color:"green" }, // Via Cavour (alta)
    { origin: { lat: 45.063790175987876, lng: 7.687128125237991 }, destination: { lat: 45.061646640683115, lng: 7.692942501008041}, color:"yellow" }, // Via Cavour (bassa)
    { origin: { lat: 45.06324189359703, lng: 7.688617244651047 }, destination: { lat: 45.06272831357299, lng: 7.690113048713667}, color:"red" }, // Piazza Cavour
    { origin: { lat: 45.06663782004458, lng: 7.692563832330559 }, destination: { lat: 45.06401095388637, lng: 7.6906563906483845}, color:"green" }, // Via delle Rosine
    { origin: { lat: 45.065028159126825, lng: 7.6948335148548015 }, destination: { lat: 45.063325790457135, lng: 7.692640754725923}, color:"green" }, // Via delle Rocca (alta)
    { origin: { lat: 45.063325790457135, lng: 7.692640754725923 }, destination: { lat: 45.059179182272736, lng: 7.689368444513095}, color:"yellow" }, // Via delle Rocca (bassa)
    { origin: { lat: 45.062447570711534, lng: 7.680215540808145 }, destination: { lat: 45.05883035270143, lng: 7.690261901850371}, color:"green" }, // Corso Vittorio (lato sx)
    { origin: { lat: 45.065192525657544, lng: 7.679180038025688 }, destination: { lat: 45.06332312736903, lng: 7.677817508113456}, color:"yellow" }, // Via XX Settembre


    
  ];

  const handleSetSteps = (newSteps: google.maps.DirectionsStep[]) => {
    setSteps(newSteps);
  };

  // Gestione dei tocchi sulla mappa per abilitare/disabilitare lo swipe
  const handleTouchStart = (event: React.TouchEvent) => {
    if (event.touches.length === 1) {
      setTouchStart({ x: event.touches[0].clientX, y: event.touches[0].clientY });
      setIsSingleTouch(true);
      enableSwipe(); // Abilita lo swipe con un solo tocco
    } else if (event.touches.length === 2) {
      setIsSingleTouch(false);
      disableSwipe(); // Disabilita lo swipe con due tocchi contemporanei
    }
  };

  const handleShowPopup = () => {
    setOrigin(""); // Reimposta il campo Origine
    setDestination(""); // Reimposta il campo Destinazione
    setShowPopup(true);
};

  const handleTouchMove = (event: React.TouchEvent) => {
    if (!isSingleTouch && touchStart) {
      const dx = event.touches[0].clientX - touchStart.x;
      const dy = event.touches[0].clientY - touchStart.y;

      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        disableSwipe(); // Disabilita lo swipe se c'è movimento significativo
      }
    }
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (event.touches.length === 0) {
      enableSwipe(); // Riabilita lo swipe quando il tocco è finito
    }
  };
  

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log(`Lat: ${latitude}, Lng: ${longitude}, Accuracy: ${accuracy} meters`);
          if (accuracy > 50) { // Soglia per l'accuratezza
            console.warn("La precisione è bassa. Attiva il GPS o verifica le impostazioni.");
          }
          setCurrentPosition({ lat: 45.06805628881586, lng: 7.694417510580424 });
        },
        (error) => {
          console.error("Errore nel recupero della posizione:", error);
        },
        { enableHighAccuracy: true } // Richiede dati GPS più accurati
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
  useEffect(() => {
    if (destinationCoords) {
      console.log("Destinazione aggiornata:", destinationCoords);
    }
  }, [destinationCoords]);

  const handleNavigateToHome = async() => {
    if (!currentPosition) {
      alert("Posizione corrente non disponibile.");
      return;
    }
        // Ottieni il servizio di geocodifica dalla libreria di Google Maps
    
        if (google) {
          const geocoder = new google.maps.Geocoder();
    
          try {
            const response = await geocoder.geocode({ address: homeAddress });
            if (response.results.length > 0) {
              const location = response.results[0].geometry.location;
              const latLng = {
                lat: location.lat(),
                lng: location.lng(),
              };
               setHomeCoords(latLng);
               console.log("Coordinate di casa impostate:", latLng);
            } else {
              alert("Non è stato possibile trovare l'indirizzo. Riprova con un altro.");
            }
          } catch (error) {
            console.error("Errore durante la geocodifica:", error);
            alert("Si è verificato un errore durante il calcolo delle coordinate. Riprova.");
          } 
        } else {
          alert("Le API di Google Maps non sono disponibili.");
        }
  };

  // UseEffect per verificare quando homeCoords è stato aggiornato
  useEffect(() => {
    if (homeCoords) {
        // Esegui la logica di navigazione solo quando homeCoords è disponibile
        if (!currentPosition) {
            alert("Posizione corrente non disponibile.");
            return;
        }

        const pos = `${currentPosition.lat}, ${currentPosition.lng}`;
        const dest = `${homeCoords.lat}, ${homeCoords.lng}`;
        setOrigin(pos);
        setDestination(dest);
        setDestinationCoords(homeCoords);
        setIsFlagHome(true)
        setIsStandard(false);
        setIsNavigationStarted(true);
        handleStartHomeNavigation();
    }
  }, [homeCoords]);

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

  useEffect(() => {
    if (routes.length > 0) {
      routes.forEach(({ origin, destination }) => {
        const start = `${origin.lat}, ${origin.lng}`
        const end = `${destination.lat}, ${destination.lng}`
        setOrigin(start)
        setDestination(end)
        handleShowPath();
      });
    }
  }, []); // Eseguito una sola volta all'apertura
  
  const handleShowPath = async () => {
    setIsStandard(true);
  
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
    handleExitPath
  };

  const handleExitPath  = () => {
    setIsNavigationStarted(false); // Termina la navigazione
    setOrigin(""); // Cancella l'origine
    setDestination(""); // Cancella la destinazione
    setDestinationCoords(null); // Cancella le coordinate della destinazione

  };

  const handleStartHomeNavigation = async () => {   
    setIsNavigationStarted(true); // Inizia la navigazione
    setIsStandard(false);
  };

  const handleStartNavigation = async () => {
    if (!origin || !destination) {
      setShowPopup(false);
      setInputAlert(true);
      return;
    }
  
    setIsNavigationStarted(true); // Inizia la navigazione
    setShowPopup(false); // Chiudi il popup
    setIsStandard(false);
  
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
    setIsFlagGeneric(true);
  };
  
  const handleExitNavigation = () => {
    setIsNavigationStarted(false); // Termina la navigazione
    setOrigin(""); // Cancella l'origine
    setDestination(""); // Cancella la destinazione
    setDestinationCoords(null); // Cancella le coordinate della destinazione
    setIsFlagHome(false);
    setIsFlagGeneric(false);

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
    <>
        <Button
      style={{
        position: "absolute",
        bottom: "130px", // Sposta il pulsante sopra i tasti di zoom
        right: "6px", // Allinea il pulsante a destra
        background: "transparent",
        border: "none",
        padding: 0,
        zIndex: 1, // Assicurati che il pulsante sia sopra la mappa
        cursor: "pointer",
      }}
      onClick={(e) => handleTabClick(e, 2)}
    >
      <img
        src="/notalone/sos/sos_button.svg"
        alt="SOS Button"
        style={{ width: "60px", height: "60px" }}
      />
    </Button>

    {!isNavigationStarted && (
      <Button
        style={{
          position: "absolute",
          bottom: "30px", // Sposta il pulsante sopra i tasti di zoom
          right: "285px", // Allinea il pulsante a destra
          background: "transparent",
          border: "none",
          padding: 0,
          zIndex: 2, // Assicurati che il pulsante sia sopra la mappa
          cursor: "pointer",
        }}
        onClick={handleNavigateToHome}
      >
        <img
          src="/notalone/home_button.png"
          alt="Home Button"
          style={{ width: "55px", height: "55px" }}
        />
      </Button>
    )}

    {/* Legenda */}
    <div
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        background: "rgb(221, 221, 248)",
        borderRadius: "20px", // Bordi molto arrotondati
        padding: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Effetto ombra per il riquadro
        zIndex: 2, // Assicurati che la legenda sia sopra la mappa
      }}
    >
      <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "bold" }}>
        Legenda
      </h4>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
        <div
          style={{
            width: "20px",
            height: "4px",
            backgroundColor: green,
            marginRight: "8px",
            borderRadius: "2px",
          }}
        ></div>
        <span style={{ fontSize: "15px" }}>Sicura</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
        <div
          style={{
            width: "20px",
            height: "4px",
            backgroundColor: yellow,
            marginRight: "8px",
            borderRadius: "2px",
          }}
        ></div>
        <span style={{ fontSize: "15px" }}>Possibili rischi</span>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: "20px",
            height: "4px",
            backgroundColor: red,
            marginRight: "8px",
            borderRadius: "2px",
          }}
        ></div>
        <span style={{ fontSize: "15px" }}>Rischiosa</span>
      </div>
    </div>


    <APIProvider apiKey={"AIzaSyBKdoXYHzSpJ6wc3AGnZVEjef8NYNUACyc"}>
      <div
        style={{  height: "70vh", width: "100%" }}
        ref={mapRef} 
        onTouchStart={handleTouchStart} // Aggiungi gli eventi di touch direttamente alla mappa
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Map
          defaultCenter={currentPosition}
          defaultZoom={14}
          mapId={"538ae0fea393aa85"}
          fullscreenControl={false}
          gestureHandling="greedy"
          streetViewControl={false}
          mapTypeId="terrain" // Imposta la mappa su rilievo
          mapTypeControl={false} // Disabilita il toggle tra i tipi di mappa
        >
          <AdvancedMarker position={currentPosition}>
            <div style={styles.circle}></div>
          </AdvancedMarker>

          {origin && destination && isStandard && (
        <>
          {/* Renderizza tutte le rotte senza sovrascrivere le polilinee */}
          {routes.map(({ origin, destination, color }, index) => (
            <Directions
              key={index}
              origin={`${origin.lat}, ${origin.lng}`}
              destination={`${destination.lat}, ${destination.lng}`}
              currentPosition={currentPosition}
              clearDirections={!isNavigationStarted}
              usePolylineOnly={true}
              color = {color}
              handleSetSteps={handleSetSteps}
            />
          ))}
        </>
      )}

          {origin && destination && isNavigationStarted && !isStandard && (
            <Directions
              origin={origin}
              destination={destination}
              currentPosition={currentPosition}
              clearDirections={!isNavigationStarted}
              usePolylineOnly={false}
              color = {color}
              handleSetSteps={handleSetSteps}
            />
          )}

          {/* Aggiungi il marker sulla destinazione */}
          {isFlagGeneric && (
            <AdvancedMarker position={destinationCoords}>
              <div style={styles.flag}></div>
            </AdvancedMarker>
          )}
          {/* Aggiungi il marker sulla destinazione home */}
          {isFlagHome && (
            <AdvancedMarker position={homeCoords}>
              <div style={styles.flag}></div>
            </AdvancedMarker>
          )}
        </Map>

        {/* Barra di ricerca */}
        {!isNavigationStarted && (
          <div style={styles.searchBar} onClick={handleShowPopup}>
            <span style={styles.searchText}>Cerca un percorso...</span>
          </div>
        )}
        

        {isNavigationStarted && (
          <div style={styles.navigationBar}>

            <button
              style={styles.exitNavigationButton}
              onClick={handleExitNavigation}
            >
               <img
                src="/notalone/exit.png"
                alt="Exit"
                style={styles.exitImage}
              />
            </button>

            <div style={styles.directionsText}>
              {currentStepIndex < steps.length ? (
                <>
                  <p>{stripHtml(steps[currentStepIndex]?.instructions || "")}</p>    
                  <p>
                    <strong>Distanza:</strong> {steps[currentStepIndex]?.distance?.text}
                  </p>
                </>
              ) : (
                <p>Hai raggiunto la destinazione!</p>
              )}
            </div> 
            
          </div>
        )}

        {/* Pop up quando si preme Avvia senza aver messo orgine o destinazione */}
        {inputAlert &&(
        <div style={styles.popupOverlay}>
          <div style={styles.card}>
            <Message
              style={{
                      border: 'none',
                      color: '#696cff',
                      width: "100%"
              }}
              className="border-primary w-full justify-content-start"
              severity="info"
              content={content}
            />
            <span style={styles.clearButton2} onClick={() => setInputAlert(false)}>
                   ✕
            </span>
          </div>
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
    </>
  );
}

const Directions = ({
  origin,
  destination,
  currentPosition,
  clearDirections,
  usePolylineOnly, // Aggiunto parametro per differenziare il comportamento
  color,
  handleSetSteps
}: {
  origin: string;
  destination: string;
  currentPosition: LatLng;
  clearDirections: boolean;
  usePolylineOnly: boolean; // Parametro booleano per scegliere il comportamento
  color : string;
  handleSetSteps
}) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [path, setPath] = useState<google.maps.LatLng[]>([]); // Mantieni il tipo LatLng
  const red = "#FF0000";
  const green = "#00FF00";
  const yellow = "#FFA500";
  

  // Inizializza il DirectionsService e il DirectionsRenderer
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

  // Calcola il percorso o solo la Polyline
  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    if(usePolylineOnly == true)
      clearDirections=false

    if (clearDirections) {
      directionsRenderer.setMap(null); // Rimuove il percorso dalla mappa
      return;
    }

    // Gestisci le posizioni di origine e destinazione
    const originPosition = origin === "La mia posizione" ? `${currentPosition.lat}, ${currentPosition.lng}` : origin;
    const destinationPosition = destination === "La mia posizione" ? `${currentPosition.lat}, ${currentPosition.lng}` : destination;

    if (usePolylineOnly) {
      // Solo calcolare il percorso per la Polyline
      directionsService
        .route({
          origin: originPosition,
          destination: destinationPosition,
          travelMode: google.maps.TravelMode.WALKING,
          provideRouteAlternatives: true,
        })
        .then((response) => {
          // Estrai il percorso per la Polyline
          const route = response.routes[0].overview_path; // Ottieni il percorso dalla risposta

          // Mappa correttamente i punti LatLng senza modificarli
          const pathArray = route.map((point: google.maps.LatLng) => point); // Mantieni i LatLng come sono

          setPath(pathArray); // Salva il percorso per la Polyline
          
        })
        .catch((err) => console.error("Errore Polyline:", err));
    } else {
      // Calcola le direzioni e mostra il percorso sulla mappa
      directionsService
        .route({
          origin: originPosition,
          destination: destinationPosition,
          travelMode: google.maps.TravelMode.WALKING,
          provideRouteAlternatives: true,
        })
        .then((response) => {
          // Imposta le indicazioni e il percorso per il renderer
          const legs = response.routes[0]?.legs[0];
        if (legs) {
          handleSetSteps(legs.steps); // Salva i passi per la navigazione
        }
         // Percorso sulla mappa in viola
         directionsRenderer.setOptions({
          directions: response,
          polylineOptions: {
            strokeColor: "#800080", // Viola
            strokeOpacity: 0.8, 
            strokeWeight: 5, 
          },
        });
        })
        .catch((err) => console.error("Errore Directions:", err));
    }
  }, [directionsService, directionsRenderer, origin, destination, currentPosition, clearDirections, usePolylineOnly]);

  // Aggiungi la Polyline alla mappa (se usato `usePolylineOnly`)
  useEffect(() => {
    if (!path.length || !map || !usePolylineOnly) return;

    // Determina il colore della polyline in base al valore di "color"
    let lineColor = "#000000"; // Default color (nero)
    if (color === "red") {
      lineColor = red; // Rosso
    } else if (color === "green") {
      lineColor = green; // Verde
    } else if (color === "yellow") {
      lineColor = yellow; // Giallo
    }

    // Aggiungi la Polyline alla mappa
    const polyline = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: lineColor, 
      strokeOpacity: 0.5,
      strokeWeight: 3, // Spessore della Polyline
    });

    polyline.setMap(map);


  }, [path, map, usePolylineOnly]);

  return null;
};





const styles = {
  searchBar: {
    position: "absolute" as const,
    bottom: 40,
    left: "52%",
    transform: "translateX(-50%)",
    width: "60%",
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
  popupContent: {
    background: "white",
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    width: 300,
    height: 220
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
    zIndex: "10",
  },
  card: {
    width: "200px",
    background: "rgb(241, 241, 241)",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center" as const,
    zIndex: "10",
  },
  popup: {
    width: "300px",
    background: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center" as const,
    zIndex: "10",
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
  navigationBar: {
    position: "absolute" as const,
    bottom: 20,
    left: 20,
    width: "75%",
    borderRadius: "25px",
    backgroundColor: "rgb(226, 226, 245)",
    boxShadow: "0px -2px 10px rgba(0,0,0,0.1)",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 3,
  },
  directionsText: {
    fontSize: "16px",
    color: "#333",
  },
  exitNavigationButton: {
    background: "transparent",
    border: "none",
  },
  exitImage: {
    width: "60px",
    height: "60px",
  },
  clearButton2: {
    position: "absolute" as const,
    right:"112px",
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
    left: 160,
    backgroundColor: "rgba(185, 9, 9, 0.65)",
    borderRadius: "50%",
    width: "54px", // Larghezza maggiore per rendere il pulsante più grande
    height: "54px", // Altezza maggiore per un pulsante perfettamente circolare
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
  },
};
