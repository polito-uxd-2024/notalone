import React, { useState, useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from "framer-motion";
import './App.css'

import Navigation from './components/Navigation'
import { DefaultLayout, MainLayout, LoadingLayout, SOSLayout, MapsLayout, PageNotFound } from './components/PageLayout'

import LanguageContext from "./LanguageContext";


const App = ({ isItalian, loading, chatStarted, startChat }) => {
  return (
    <HashRouter>
      <LanguageContext.Provider value={isItalian}>
        <Navigation />
        <AnimatedRoutes
          loading={loading}
          chatStarted={chatStarted}
          startChat={startChat}
        />
      </LanguageContext.Provider>
    </HashRouter>
  );
};

const AnimatedRoutes = ({ loading, chatStarted, startChat }) => {
  const location = useLocation();
  const [prevPath, setPrevPath] = useState(['/']);

  useEffect(() => {
    console.log('Location:', location.pathname);
    setPrevPath((prev) => [prev[1], location.pathname]);
  }, [location.pathname]);

  const getPrev = () => {
    const prev = prevPath.slice(0, -1);
    return prev[prev.length - 1] || '/';
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <MotionWrapper path={location.pathname} getPrev={getPrev}>
              <DefaultLayout />
            </MotionWrapper>
          }
        >
          <Route
            index
            element={
              <MotionWrapper path={location.pathname} getPrev={getPrev}>
                {loading ? (
                  <LoadingLayout />
                ) : (
                  <MainLayout chatStarted={chatStarted} startChat={startChat} />
                )}
              </MotionWrapper>
            }
          />
          <Route
            path="/sos"
            element={
              <MotionWrapper path={location.pathname} getPrev={getPrev}>
                <SOSLayout />
              </MotionWrapper>
            }
          />
          <Route
            path="/maps"
            element={
              <MotionWrapper path={location.pathname} getPrev={getPrev}>
                <MapsLayout />
              </MotionWrapper>
            }
          />
          <Route
            path="/settings"
            element={
              <MotionWrapper path={location.pathname} getPrev={getPrev}>
                <MapsLayout />
              </MotionWrapper>
            }
          />
          <Route
            path="*"
            element={
              <MotionWrapper path={location.pathname} getPrev={getPrev}>
                <PageNotFound />
              </MotionWrapper>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const elements = {
  '/maps': {
    '/': { initial: '-100%', exit: '-100%' },
    '/sos': { initial: '-100%', exit: '-100%' },
    '/maps': { initial: '0%', exit: '0%' }
  },
  '/': {
    '/maps': { initial: '100%', exit: '-100%' },
    '/sos': { initial: '-100%', exit: '100%' },
    '/': { initial: '0%', exit: '0%' }
  },
  '/sos': {
    '/': { initial: '100%', exit: '100%' },
    '/maps': { initial: '100%', exit: '100%' },
    '/sos': { initial: '0%', exit: '0%' }
  }
};
const MotionWrapper = ({ children, path, getPrev }) => {
  path = path.toLowerCase()
  const prev = getPrev().toLowerCase()
  const direction = elements[path][prev];
  console.log('Current path:', direction);
  // console.log('Previous path:', prev);
  return (
    <motion.div
      initial={{ x: direction.initial, opacity: 1 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction.exit, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default App;
