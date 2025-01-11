import React, { useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

import Navigation from './components/Navigation'
import { MainLayout } from './components/PageLayout'

import LanguageContext from "./LanguageContext";

function App() {
  const [isItalian, changeLanguage] = useState(true);
  
  const handleLanguage = () => {
    changeLanguage((lang) => {return !lang})
  }

  return (
  // <BrowserRouter>
    <HashRouter>
      <LanguageContext.Provider value={isItalian}>
        <Navigation />
        {/* <Routes>
          <Route path="/*" element={<MainLayout/>}>
            {/* <Route index element={<MainLayout />} />
            <Route path='*' element={<MainLayout />} /> 
          </Route>
        </Routes> */}
        <MainLayout />
      </LanguageContext.Provider>
    </HashRouter>
  )
}

export default App
