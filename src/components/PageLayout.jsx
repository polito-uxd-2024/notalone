import React, { useEffect, useState, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { SOS } from './SOS/SOS';
import { Al } from './Al/Al';
import { Maps } from './Maps/Maps';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';


function MainLayout () {
  const [chatStarted, startChat] = useState(false);
  const [sosTimer, startSosTimer] = useState(false);
  const [sosBack, setSosBack] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [actualLocation, editActualLocation] = useState(1);
  
  const tabsRef = useRef();
  const swiperRef = useRef(null);

  const tabs = [
    { tab: "Maps", shift: "34%" },
    { tab: "Al", shift: "0%" },
    { tab: "SOS", shift: "-34%" },
  ];

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
    setSosBack(true);
    handleLocationChange(actualLocation);
  }

  useEffect(() => {
    console.log('useEffect: ', actualLocation, " ", activeTab);
    if (activeTab === 2) {
      console.log('Timer started');
      startSosTimer(true);
    }
    if (sosBack) {
      setSosBack(false);
    }
  }, [sosBack, activeTab]);

  return (
    <Row className='vh-100'>
        <Col className="below-nav">
          <div className="tabs-wrapper">
            <div className="tabs" ref={tabsRef}>
              {tabs.map((tab, index) => (
                <div
                key={index}
                className={`tab ${activeTab === index ? "active" : ""}`}
                onClick={(e) => handleTabClick(e, index)}
              >
                {tab.tab}
              </div>
              ))}
            </div>
          </div>
        </Col>
        <Col className="below-tab">
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
                startSosTimer(true);
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
            <SwiperSlide><Maps handleTabClick={handleTabClick}/></SwiperSlide>
            <SwiperSlide><Al chatStarted={chatStarted} startChat={startChat} /></SwiperSlide>
            <SwiperSlide><SOS start={sosTimer} setStart={startSosTimer} handleBack={handleBack} /></SwiperSlide>
          </Swiper>
        </Col>
      </Row>
  );
}

export { MainLayout }