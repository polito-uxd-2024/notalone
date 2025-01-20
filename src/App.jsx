import React, { useState } from 'react'
import { HashRouter } from 'react-router-dom'
import { PrimeReactProvider } from 'primereact/api';
import '/node_modules/primeflex/primeflex.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";

import './App.css'

import Navigation from './components/Navigation'
import { MainLayout } from './components/PageLayout'


function App() {
  return (
    <HashRouter>
      <Navigation />
      <MainLayout />
    </HashRouter>
  )
}

export default App
