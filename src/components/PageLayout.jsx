import React, { useEffect, useState, useRef, act } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { SOS } from './SOS/SOS';
import { AlHome } from './Al/AlHome';
import { Maps } from './Maps/Maps';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';


function MainLayout () {
  const [chatStarted, startChat] = useState(false);
  const [sosTimer, startTimer] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  const location = useLocation();
  
  const tabsRef = useRef();
  const swiperRef = useRef(null);

  const tabs = [
    { url: "/maps", tab: "Maps", shift: "34%" },
    { url: "/", tab: "Al", shift: "0%" },
    { url: "/sos", tab: "SOS", shift: "-34%" },
  ];

  const updateSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const path = location.pathname.split('/').pop();
      const slideIndex = location.pathname === '/' ? 1 : ['maps', '', 'sos'].indexOf(path);
      if (slideIndex !== -1) {
        swiperRef.current.swiper.slideTo(slideIndex);
        // console.log("updateSlide: ")
        // updateTab(slideIndex)
      }
    }
  };

  const updateTab = (index) => {
    setActiveTab(index);
    console.log(tabsRef.current)
    tabsRef.current.style.left = tabs[index].shift;
    // tabsRef.current.scrollLeft = tabs[index].shift;
  };
  const handleTabClick = (e, index) => {
    // console.log('Tab clicked: ', index);
    // console.log('Active Tab: ', activeTab);
    if(activeTab === 2) {
      e.preventDefault()
    } else {
      // console.log('handleCLick: ', activeTab);
      updateTab(index);
    }
  };
  useEffect(() => {
    window.history.pushState(null, '', '#/');
    window.history.pushState(null, '', '#/');
  }, []);

  useEffect(() => {
    updateSlide();
    if (location.pathname === '/sos') {
      console.log('Timer started');
      startTimer(true);
    }
  }, [location]);

  return (
    <Row className='vh-100'>
        <Col className="below-nav">
          <div className="tabs-wrapper">
            <div className="tabs" ref={tabsRef}>
              {tabs.map((tab, index) => (
                <Link
                key={index}
                to={tab.url}
                className={`tab ${activeTab === index ? "active" : ""}`}
                onClick={(e) => handleTabClick(e, index)}
              >
                {tab.tab}
              </Link>
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
              const paths = ['#/maps', '#/', '#/sos'];
              const newPath = paths[swiper.activeIndex];
              // console.log('New path: ', newPath);
              window.history.replaceState(null, '', newPath);
              console.log('onSlideChange: ')
              updateTab(swiper.activeIndex);
              // handleTabClick(swiper, swiper.activeIndex);
              if (newPath === '#/sos') {
                swiper.el.style.cursor = 'default';
                swiper.allowTouchMove = false;
                swiper.allowClick = false;
                console.log(swiper);
                startTimer(true);
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
            <SwiperSlide><Maps /></SwiperSlide>
            <SwiperSlide><AlHome chatStarted={chatStarted} startChat={startChat} /></SwiperSlide>
            <SwiperSlide><SOS start={sosTimer} setStart={startTimer} /></SwiperSlide>
          </Swiper>
          <Outlet />
        </Col>
      </Row>
  );
}

export { MainLayout }