import React, { useState, useEffect, useRef } from "react";
import { Message } from 'primereact/message';
import { AutoComplete, AutoCompleteChangeEvent } from 'primereact/autocomplete';
import { createAutocompleteRequest } from "./Autocomplete";
import "./Maps.css"

import {
  APIProvider,
  Map,
  ControlPosition,
  MapControl,
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

export default function Maps({ disableSwipe, enableSwipe, handleLocationChange, homeAddress }: { disableSwipe: () => void; enableSwipe: () => void; handleLocationChange: (index) => void; homeAddress }) {
  const [currentPosition, setCurrentPosition] = useState<LatLng>({ lat: 45.06805628881586, lng: 7.694417510580424 });
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
  const [apiKey, setKey] = useState('')
  const [isSingleTouch, setIsSingleTouch] = useState(true); // Stato per rilevare il tocco singolo
  const mapRef = useRef(null);
  let color = "";
  const [invalidOrigin, setInvalidOrigin] = useState(false);
  const [invalidDestination, setInvalidDestination] = useState(false);
  const [homeCoords, setHomeCoords] = useState<LatLng | null>(null); // Stato per l'indirizzo di casa
  const [homeCoordsIcon, setHomeCoordsIcon] = useState<LatLng | null>(null);
  const isHomeInitialized = useRef(false); // Riferimento per verificare l'inizializzazione
  const [steps, setSteps] = useState<google.maps.DirectionsStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([])
  const stripHtml = (html: string) => html.replace(/<\/?[^>]+(>|$)/g, "");
  const red = "#FF0000";
  const green = "#00FF00";
  const yellow = "#FFA500";
  const content = (
    <div className="flex align-items-center">
        <img alt="logo" src="al_triste.svg" width="42" />
        <div className="ml-2"><strong>Inserisci sia origine che destinazione</strong></div>
    </div>
);

const [googleLoaded, setGoogleLoaded] = useState(false);

useEffect(() => {
  const loadGoogleMapsAPI = async () => {
    try {
      // Recupera la chiave API dal server
      const res = await fetch('https://better-adversely-insect.ngrok-free.app/api/key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const keyJson = await res.json();
      const key = keyJson.key;
      setKey(key)
      if (key) {
        // Crea lo script per caricare l'API di Google Maps
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
        script.async = true;
        script.onload = () => {
          setGoogleLoaded(true); // L'API è stata caricata
        };
        document.head.appendChild(script);
      } else {
        console.error("Chiave API non trovata.");
      }
    } catch (error) {
      console.error("Errore nel recuperare la chiave API:", error);
    }
  };

  loadGoogleMapsAPI();

  return () => {
    // Pulizia: rimuovi lo script quando il componente viene smontato
    const script = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
    if (script) {
      document.head.removeChild(script);
    }
  };
}, []);

  

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

  const fetchSuggestions = async (event) => {
    const userInput = event.query; // Recupera il testo digitato dall'utente

    if (!userInput) {
      setSuggestions([]);
      return;
    }
    // @ts-ignore
    const { Place, AutocompleteSessionToken, AutocompleteSuggestion } = await google.maps.importLibrary("places");
    let request = {
      input: event.query,
      locationRestriction: {
        west: currentPosition.lng - 0.1,
      east: currentPosition.lng + 0.1,
      north: currentPosition.lat + 0.1,
      south: currentPosition.lat - 0.1,
      },
      origin: { lat: currentPosition?.lat, lng: currentPosition?.lng },
      includedPrimaryTypes: [],
      language: "it",
      region: "eu",
    };
    // Create a session token.
    const token = new AutocompleteSessionToken();
    const { suggestions } =
    await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

    const userInputHome = event.query.toLowerCase();
    const shouldAddCasa = userInputHome.startsWith("c") || userInputHome.startsWith("ca") || userInputHome.startsWith("cas") || userInputHome.startsWith("casa");

    // Mappa le suggestion e formatta il testo
    const formattedSuggestions = suggestions.map((s) => {
      const text = s.placePrediction.text.toString();
      const split = text.split(",");
      return split.slice(0, 2).join(",");
    });

    // Aggiungi "Casa" come prima opzione se necessario
    if (shouldAddCasa) {
      setSuggestions(["Casa", ...formattedSuggestions]);
    } else {
      setSuggestions(formattedSuggestions);
    }
    
    
    // Add the token to the request.
    // @ts-ignore
    request.sessionToken = token;
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
          // setCurrentPosition({ lat: 45.06805628881586, lng: 7.694417510580424 });
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
        setInvalidOrigin(false);
        setOrigin("La mia posizione");
      } else if (type === "destination") {
        setInvalidDestination(false);
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


  const showHome = () => {
    const waitForGoogleMaps = () => {
      if (typeof google !== "undefined" && google.maps) {
        // API di Google Maps disponibili
        const geocoder = new google.maps.Geocoder();
  
        geocoder.geocode({ address: homeAddress }, (results, status) => {
          if (status === "OK" && results && results.length > 0) {
            const location = results[0].geometry.location;
            const latLng = {
              lat: location.lat(),
              lng: location.lng(),
            };
            setHomeCoordsIcon(latLng);
          } else if (status !== "OK") {
            console.error("Errore durante la geocodifica:", status);
            alert("Si è verificato un errore durante il calcolo delle coordinate. Riprova.");
          } else {
            alert("Non è stato possibile trovare l'indirizzo. Riprova con un altro.");
          }
        });
      } else {
        // API non ancora caricate, ritenta
        console.log("Attesa del caricamento delle API di Google Maps...");
        setTimeout(waitForGoogleMaps, 500); // Riprova dopo 500 ms
      }
    };
  
    waitForGoogleMaps(); // Avvia il controllo
  };

  useEffect(() => {
    showHome();
  }, []);



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

  const handleInputChange = (e: AutoCompleteChangeEvent, type: "origin" | "destination") => {
    type==="origin" && invalidOrigin && setInvalidOrigin(false)
    type==="destination" && invalidDestination && setInvalidDestination(false)
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
        <div className="p-autocomplete-panel p-component p-ripple-disabled p-connected-overlay-enter-done position-suggestion" data-pc-section="panel" >
          <div className="p-autocomplete-items-wrapper" style={{maxHeight: "200px"}} data-pc-section="listwrapper">
              <ul onTouchStart={() => handleSetCurrentPosition(type)} id="pr_id_12_list" className="p-autocomplete-items" role="listbox" data-pc-section="list">
                <li id="0" role="option" className="p-autocomplete-item" aria-selected="false" data-pc-section="item">Posizione attuale</li>
            </ul>
          </div>
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
      console.log(origin)
      console.log(destination)
      !origin && setInvalidOrigin(true)
      !destination && setInvalidDestination(true)
      // setShowPopup(false);
      return;
    }
    console.log(destination)
    destination === "Casa" && setDestination(homeAddress)
    origin === "Casa" && setOrigin(homeAddress)
    setInvalidOrigin(false)
    setInvalidDestination(false)
  
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
        className="loading-container"
      >
        <p>Caricamento posizione...</p>
      </div>
    );
  }

  return (
    <>
      <div
      className="maps-to-sos-button"
      onClick={() => handleLocationChange(2)}
      >
        <img
          src="icons/sos_white.svg"
          alt="SOS Button"
          style={{ padding: "5px", width: "5rem", height: "5rem" }}
        />
      </div>

    {/* Legenda */}
    <div
      className="legenda-container"
    >
      <h4 style={{ margin: "0 0 10px 0", fontSize: "18px", fontWeight: "bold" }}>
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
        <span style={{ fontSize: "15px" }}>Strada sicura</span>
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
        <span style={{ fontSize: "15px" }}>Strada prudente</span>
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
        <span style={{ fontSize: "15px" }}>Strada critica</span>
      </div>
    </div>


    {googleLoaded && <APIProvider apiKey={apiKey}>
      <div className="map-container">
        <div
          className="map-wrapper"
          ref={mapRef} 
          // onTouchStart={handleTouchStart} // Aggiungi gli eventi di touch direttamente alla mappa
          // onTouchMove={handleTouchMove}
          // onTouchEnd={handleTouchEnd}
        >
          <Map
            defaultCenter={currentPosition}
            defaultZoom={16}
            minZoom={14}
            maxZoom={18}
            restriction={{
              latLngBounds: {
                north: 45.1,  // Limite settentrionale
                south: 45.0,  // Limite meridionale
                east: 7.705,    // Limite orientale
                west: 7.6,    // Limite occidentale
              },
              strictBounds: true,
              }
            }
            zoomControlOptions={{position: google.maps.ControlPosition.RIGHT_TOP}}
            mapId={"538ae0fea393aa85"}
            fullscreenControl={false}
            gestureHandling="cooperative"
            streetViewControl={false}
            mapTypeId="terrain" // Imposta la mappa su rilievo
            mapTypeControl={false} // Disabilita il toggle tra i tipi di mappa
          >
            <AdvancedMarker position={currentPosition}>
              <div className="circle"></div>
            </AdvancedMarker>

            <AdvancedMarker position={homeCoordsIcon}>
            <div className="home"></div>
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
                <div className="flag"></div>
              </AdvancedMarker>
            )}
            {/* Aggiungi il marker sulla destinazione home */}
            {isFlagHome && (
              <AdvancedMarker position={homeCoords}>
                <div className="flag"></div>
              </AdvancedMarker>
            )}
          </Map>

          {/* Barra di ricerca */}
          {!isNavigationStarted && (
              <div className="bottom-bar">
                <div
                className="home-button mr-2"
                onClick={handleNavigateToHome}
                >
                  <i className="pi pi-home"/>
                </div>
              <div className="searchBar" onClick={handleShowPopup}>
                <i className="pi pi-search mr-3"/>
                <span className="searchText">Dove vuoi andare?</span>
              </div>
              </div>
          )}
          

          {isNavigationStarted && (
            <div className="navigationBar">

              <div className="navigation-wrapper">
              <div className="directionsText">
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
              
              <button
                className="exitNavigationButton"
                onClick={handleExitNavigation}
              >
                <i
                className="pi pi-times"
                />
              </button>
              </div>
              
            </div>
          )}

          {/* Pop up quando si preme Avvia senza aver messo orgine o destinazione */}
          {inputAlert &&(
          <div className="popupOverlay">
            <div className="card">
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
              <span className="clearButton2" onClick={() => setInputAlert(false)}>
                    ✕
              </span>
            </div>
          </div>
          )}
          

          {/* Popup modale per l'inserimento */}
          {showPopup && !isNavigationStarted && (
            <div className="popupOverlay">
              <div className="popup">
                {(invalidOrigin || invalidDestination) ? <img src="al/al_sad.svg" alt="Al" className="al-home-image"/> : <img src="al/al.svg" alt="Al" className="al-home-image"/>}
                <h2>Dove vuoi andare?</h2>
                {/* Origine */}
                <div className="labelContainer gap-1">
                  <label htmlFor="origin">
                    Origine:
                    </label>
                    <div id='origin' className="inputContainer">
                    <AutoComplete invalid={invalidOrigin} aria-describedby="origin-help" placeholder="Scegli origine" value={origin || ""} onFocus={() => {setShowSuggestions("origin")}} onChange={(e) => handleInputChange(e, "origin")} completeMethod={fetchSuggestions} suggestions={suggestions} />
                    {/* <InputText placeholder="Es. Piazza Castello" variant="filled" onFocus={() => setShowSuggestions("origin")} value={origin || ""} onChange={(e) => handleInputChange(e, "origin")} /> */}
                      {origin && (
                        <span className="clearButton" onClick={() => setOrigin("")}>
                          <i className="pi pi-times" style={{fontSize: '15px'}}/>
                        </span>
                      )}
                          </div>
                        <small id="origin-help" className={`${invalidOrigin}-error-message`}>
                          Inserisci un'origine valida.
                      </small>
                  {showSuggestions === "origin" && renderSuggestions("origin")}
                </div>

                {/* Destinazione */}
                <div className="labelContainer gap-1">
                <label htmlFor="destinazione">
                    Destinazione:
                    </label>
                    <div id="destinazione" className="inputContainer">
                      <AutoComplete invalid={invalidDestination} aria-describedby="destinazione-help" placeholder="Scegli destinazione" value={destination || ""} onFocus={() => setShowSuggestions("destination")} onChange={(e) => handleInputChange(e, "destination")} completeMethod={fetchSuggestions} suggestions={suggestions} />
                      {destination && (
                        <span className="clearButton" onClick={() => setDestination("")}>
                          <i className="pi pi-times" style={{fontSize: '15px'}}/>
                        </span>
                      )}
                    </div>
                    <small id="origin-help" className={`${invalidDestination}-error-message`}>
                          Inserisci una destinazione valida.
                      </small>
                  {showSuggestions === "destination" && renderSuggestions("destination")}
                </div>
                <div className="buttonContainer">
                  <button className="closeButton" onClick={() => {setShowPopup(false); setInvalidDestination(false); setInvalidOrigin(false)}}><i className="pi pi-times"/></button>
                  <button className="startButton" onClick={handleStartNavigation}>Avvia</button>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </APIProvider>}
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
