import React, { useEffect, useState, useRef } from 'react';
import { SOS } from './SOS/SOS';
import { Al } from './Al/Al';
import { Settings } from './Settings/Settings';
import  Maps  from './Maps/Maps';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ConfirmDialog } from "primereact/confirmdialog";
import 'swiper/css';


/**TODO
 * Aggiungere icona impostazioni su Al
 * Aggiungere freccina o + su AL in AlChat
 * Sistemare allineamento telefono
 * Unifromare dimensioni scritte
 * Settings: fare in modo che Al e Maps siano esclusivi
 * 
 */


function MainLayout () {
  const [chatStarted, startChat] = useState(false);
  const [inCall, startCall] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [actualLocation, editActualLocation] = useState(1);
  const [settings, goToSettings] = useState(false);
  const [voice, setVoice] = useState("Voce 1")
  const [language, setLanguage] = useState("Italiano")
  const [al, setAl] = useState(['', 'Diretta', ''])
  const [street, setStreet] = useState("Via Strada Comunale 7")
  const [showConfirm, setShowConfirm] = useState(false);
  const tabsRef = useRef();
  const swiperRef = useRef(null);
  
  const tabs = [
    { tab: "Maps", shift: "34%" },
    { tab: "Al", shift: "0%" },
    { tab: "SOS", shift: "-34%" },
  ];
  
  const disableSwipe = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.allowTouchMove = false;
    }
  };
  
  const enableSwipe = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.allowTouchMove = true;
    }
  };
  
  const updateSlide = (index) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };
  
  const updateTab = (index) => {
    console.log(window.history)
    setActiveTab(index);
    tabsRef.current.style.left = tabs[index].shift;
    // tabsRef.current.scrollLeft = tabs[index].shift;
  };
  
  const handleStart = (chat, call) => {
    if (chat){
      window.history.pushState(chatStarted, chatStarted, '/notalone/');
    }
    console.log("chat: ", chat, " call: ", call)
    startChat(chat);
    startCall(call);
  }
  
  const handleEndCall = () => {
    startCall(false)
  }
  
  const handleLocationChange = (index) => {
    updateTab(index);
    updateSlide(index);
    if (index !== 2){
      editActualLocation(index);
    }
  }
  const handleTabClick = (e, index) => {
    console.log('Tab clicked: ', index);
    if(activeTab === 2) {
      e.preventDefault()
    } else {
      handleLocationChange(index);
    }
  };

  const handleBack = () => {
    handleLocationChange(actualLocation);
  }

  const handleSettings = (bool) => {
    goToSettings(bool);
  }

  const handleNewSettings = (newVoice, newLanguage, newStreet, newAl) => {
    setLanguage(newLanguage)
    setStreet(newStreet)
    setVoice(newVoice)
    setAl(newAl)
  }

  const acceptLeave = () => {
    setShowConfirm(false);
    window.removeEventListener("beforeunload", () => {}); // Rimuovi il listener per permettere l'uscita.
    window.location.reload(); // Simula la navigazione o lascia l'app.
  };

  const rejectLeave = () => {
    setShowConfirm(false);
  };

  useEffect(() => {
    const handlePopState = (event) => {
      console.log('popstate event: ', event);
      if (event.state) {
        console.log('event state');
        startChat(false);
        startCall(false);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault(); // Per alcuni browser, è necessario.
      event.returnValue = ""; // Mostra il dialogo nativo del browser.
      setShowConfirm(true); // Mostra il popup personalizzato.
      return ""; // Compatibilità con alcuni browser.
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  
  return (
    <div className='grid-nogutter vh-100'>
     {settings?
      <div className="below-nav">
        <div className="tabs-wrapper">
            <div className="tabs" ref={tabsRef}>
              <div
                className={`tab active`}
              >
                Settings
              </div>
            </div>
          </div>
          <div className="below-tab">
            <Settings handleSettings={handleSettings} handleNewSettings={handleNewSettings} voice={voice} language={language} al={al} street={street}/>
          </div>
      </div>
      :
      <>
        <div className="below-nav">
          <div className="tabs-wrapper">
            <div className="tabs" ref={tabsRef}>
              {tabs.map((tab, index) => (
                <div
                key={index}
                className={`tab ${activeTab === index ? "active" : (activeTab === 2 ? "disabled" : "")}`}
                onClick={(e) => handleTabClick(e, index)}
              >
                {tab.tab}
              </div>
              ))}
            </div>
          </div>
        </div>
        <div className="below-tab">
          <ConfirmDialog
            visible={showConfirm}
            onHide={() => setShowConfirm(false)}
            message="Sei sicuro di voler lasciare l'app?"
            header="Conferma Uscita"
            icon="pi pi-exclamation-triangle"
            accept={acceptLeave}
            reject={rejectLeave}
          />
          <Swiper
            ref={swiperRef}
            slidesPerView={1}
            initialSlide={1}
            onSlideChange={(swiper) => {
              handleLocationChange(swiper.activeIndex);
              // console.log('onSlideChange: ')
              updateTab(swiper.activeIndex);
              if (swiper.activeIndex === 2) {
                swiper.el.style.cursor = 'default';
                swiper.allowTouchMove = false;
                swiper.allowClick = false;
              } else {
                swiper.allowTouchMove = true;
                swiper.allowClick = true;
                swiper.el.style.cursor = 'grab';
              }
            }}
            touchEventsTarget="container"
            simulateTouch={true}
            touchRatio={1}
            touchAngle={45}
            grabCursor={true}
            >
            <SwiperSlide><Maps handleTabClick={handleTabClick} disableSwipe={disableSwipe} enableSwipe={enableSwipe}/></SwiperSlide>
            <SwiperSlide><Al chatStarted={chatStarted} handleStart={handleStart} inCall={inCall} handleEndCall={handleEndCall} handleSettings={handleSettings} /></SwiperSlide>
            <SwiperSlide><SOS handleBack={handleBack} tab={activeTab}/></SwiperSlide>
          </Swiper>
        </div>
      </>
    }
    </div>
  );
}

export { MainLayout }