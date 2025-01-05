import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Navigation from './components/Navigation'
import { DefaultLayout, MainLayout, LoadingLayout, SOSLayout, MapsLayout, PageNotFound } from './components/PageLayout'

import LanguageContext from "./LanguageContext";

function App() {
  const [isItalian, changeLanguage] = useState(true);
  const [chatStarted, startChat] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLanguage = () => {
    changeLanguage((lang) => {return !lang})
  }

  return (
  <BrowserRouter basename="/">
    <LanguageContext.Provider value={isItalian}>
      <Navigation />
      <Routes>
        <Route path="/" element={<DefaultLayout/>}>
          <Route index 
            element={loading ? <LoadingLayout/> : <MainLayout chatStarted={chatStarted} startChat={startChat}/>} />
          
          <Route path='/sos'
            element={<SOSLayout/>} />
          
          <Route path='/maps'
            element={<MapsLayout/>} />
          
          <Route path='/settings'
            element={<MapsLayout/>} />
          
          <Route path='*' element={<PageNotFound />} />
        </Route>
      </Routes>
    </LanguageContext.Provider>
  </BrowserRouter>
  )
}

export default App
