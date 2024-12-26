import React, {useEffect, useRef} from 'react';
import { Row, Col } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';

import { SOS } from './SOS/SOS';
import { AlHome } from './Al/AlHome';
import { Maps } from './Maps/Maps';
import { Swipe } from './Swipe';
import { Swiper, SwiperSlide } from 'swiper/react';
import { HashNavigation, History } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/hash-navigation';
import 'swiper/css/history';

const routes = {
    'Home': '/',
    'SOS': '/sos',
    'Maps': '/maps'
}

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

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const path = location.pathname.split('/').pop();
      const slideIndex = ['maps', 'al', 'sos'].indexOf(path);
      if (slideIndex !== -1) {
        swiperRef.current.swiper.slideTo(slideIndex);
      }
    }
  }, [location]);

  return (
    <Swiper
      ref={swiperRef}
      slidesPerView={1}
      onSlideChange={(swiper) => {
        const paths = ['maps', 'al', 'sos'];
        const newPath = paths[swiper.activeIndex];
        window.history.pushState(null, '', `/slides/${newPath}`);
      }}
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

function PageNotFound () {
    return (
    <>
    </>
    );
}

function SOSLayout(props) {
  const {chatStarted, startChat} = props;
  useEffect(() => {
    const swiper = document.querySelector('.swiper-container').swiper;
    if (swiper) {
      swiper.hashNavigation.update();
    }
  }, []);
  return (
    <>
      <Swiper
        modules={[HashNavigation, History]}
        slidesPerView={1}
        history = {{
          replaceState: true,
        }}
        hashNavigation={{ replaceState:true, watchState: true }}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
        initialSlide={1}
      >
        <SwiperSlide data-history="maps"><Maps/></SwiperSlide>
        <SwiperSlide data-history="al"><AlHome chatStarted={chatStarted} startChat={startChat}/></SwiperSlide>
        <SwiperSlide data-history="sos"><SOS/></SwiperSlide>
      </Swiper>
    </>
  );
}

function MapsLayout() {
    return (
      <>
        <Swipe next={routes['Home']}/>
        <Maps/>
      </>
    );
}

export { DefaultLayout, MainLayout, LoadingLayout, PageNotFound, SOSLayout, MapsLayout}