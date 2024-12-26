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

function MainLayout () {
    return (
    <AlHome/>
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

function AlLayout() {
    return (
      <Al/>
    );
}

function MapsLayout() {
    return (
      <Maps/>
    );
}

export { DefaultLayout, MainLayout, LoadingLayout, PageNotFound, SOSLayout, AlLayout, MapsLayout}