import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { SOS } from './SOS/SOS';
import { AlHome } from './Al/AlHome';
import { Maps } from './Maps/Maps';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';


function MainLayout () {
  const [chatStarted, startChat] = useState(false);
  const [sosTimer, startTimer] = useState(false);

  const location = useLocation();
  const swiperRef = React.useRef(null);

  const updateSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const path = location.pathname.split('/').pop();
      const slideIndex = location.pathname === '/' ? 1 : ['maps', '', 'sos'].indexOf(path);
      if (slideIndex !== -1) {
        swiperRef.current.swiper.slideTo(slideIndex);
      }
    }
  };

  useEffect(() => {
    updateSlide();
    if (location.pathname === '/sos') {
      console.log('Timer started');
      startTimer(true);
    }
    else {
      startTimer(false);
    }
  }, [location]);

  return (
    <Row className='vh-100'>
        <Col className="below-nav">
          <Swiper
            ref={swiperRef}
            slidesPerView={1}
            initialSlide={1}
            onSlideChange={(swiper) => {
              const paths = ['/maps', '/', '/sos'];
              const newPath = paths[swiper.activeIndex];
              // console.log('New path: ', newPath);
              window.history.replaceState(null, '', newPath);
              if (newPath === '/sos') {
                swiper.el.style.cursor = 'default';
                swiper.allowTouchMove = false;
                swiper.allowClick = false;
                console.log(swiper);
                startTimer(true);
              } else {
                swiper.allowTouchMove = true;
                swiper.allowClick = true;
                swiper.el.style.cursor = 'grab';
                startTimer(false);
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
            <SwiperSlide><SOS start={sosTimer} /></SwiperSlide>
          </Swiper>
        </Col>
      </Row>
  );
}

export { MainLayout }