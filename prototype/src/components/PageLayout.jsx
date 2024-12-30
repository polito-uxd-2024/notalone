import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { SOS } from './SOS/SOS';
import { AlHome } from './Al/AlHome';
import { Maps } from './Maps/Maps';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/hash-navigation';
import 'swiper/css/history';


function DefaultLayout() {
    return (
      <Row>
        <Col className="below-nav">
          <Outlet/>
        </Col>
      </Row>
    );
}

function MainLayout (props) {
  const { chatStarted, startChat } = props;
  const location = useLocation();
  const swiperRef = React.useRef(null);

  const updateSlide = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const path = location.pathname.split('/').pop();
      const slideIndex = location.pathname === '/' ? 1 : ['maps', '', 'sos'].indexOf(path);
      console.log("slideIndex: ", slideIndex);
      if (slideIndex !== -1) {
        swiperRef.current.swiper.slideTo(slideIndex);
      }
    }
  };

  useEffect(() => {
    console.log("location: ", location);
    updateSlide();
  }, [location]);

  useEffect(() => {
    console.log("swiperRef: ", swiperRef);
    if (swiperRef.current && swiperRef.current.swiper) {
      updateSlide();
    }
  }, [swiperRef]);

  return (
    <Swiper
      ref={swiperRef}
      slidesPerView={1}
      initialSlide={1}
      onSlideChange={(swiper) => {
        const paths = ['/maps', '/', '/sos'];
        const newPath = paths[swiper.activeIndex];
        console.log("newPath: ", newPath);
        window.history.replaceState(null, '', newPath);
      }}
      onSwiper={(swiper) => {
        console.log("swiper: ", swiper);
        updateSlide();
      }}
      touchEventsTarget="container"
      touchRatio={1}
      touchAngle={45}
    >
      <SwiperSlide><Maps /></SwiperSlide>
      <SwiperSlide><AlHome chatStarted={chatStarted} startChat={startChat} /></SwiperSlide>
      <SwiperSlide><SOS /></SwiperSlide>
    </Swiper>
  );
}

function LoadingLayout () {
    return (
    <>
    Loading
    </>
    );
}

export { DefaultLayout, MainLayout, LoadingLayout }