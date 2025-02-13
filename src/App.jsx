import React, { useEffect } from 'react'
import { HashRouter } from 'react-router-dom'
import '/node_modules/primeflex/primeflex.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'primeicons/primeicons.css';
 

import './App.css'

import Navigation from './components/Navigation'
import { MainLayout } from './components/PageLayout'


function App() {
  return (
    // <>
    //   <Navigation />
    //   <MainLayout />
    // </>
    <HashRouter>
      <Navigation />
      <MainLayout />
    </HashRouter>
  )
}

export default App
