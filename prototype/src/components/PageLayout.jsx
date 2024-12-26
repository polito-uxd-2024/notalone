import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

import { SOS } from './SOS/SOS';
import { Al } from './Al/Al';
import { AlHome } from './Al/AlHome';
import { Maps } from './Maps/Maps';

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
    <AlHome chatStarted={chatStarted} startChat={startChat}/>
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
      <SOS/>
    );
}

function MapsLayout() {
    return (
      <Maps/>
    );
}

export { DefaultLayout, MainLayout, LoadingLayout, PageNotFound, SOSLayout, MapsLayout}