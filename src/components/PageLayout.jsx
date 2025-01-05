import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

import { SOS } from './SOS/SOS';
import { AlHome } from './Al/AlHome';
import { Maps } from './Maps/Maps';
import { Swipe } from './Swipe';

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
    const {chatStarted, startChat} = props;
    return (
      <>
        <Swipe prev={routes['Maps']} next={routes['SOS']}/>
        <AlHome chatStarted={chatStarted} startChat={startChat}/>
      </>
      );
}

function LoadingLayout () {
    return (
    <>
    </>
    );
}

function PageNotFound () {
    return (
    <>
    </>
    );
}

function SOSLayout() {
    return (
      <>
        <Swipe prev={routes['Home']}/>
        <SOS/>
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