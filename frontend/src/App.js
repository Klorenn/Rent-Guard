import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NetworkSelector from './components/NetworkSelector';

// Pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import CreateProperty from './pages/CreateProperty';
import Rentals from './pages/Rentals';
import Wallet from './pages/Wallet';
import Dashboard from './pages/Dashboard';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  color: #ffffff;
`;

const MainContent = styled(motion.main)`
  min-height: calc(100vh - 80px);
  padding-top: 80px;
`;

function App() {
  return (
    <AppContainer>
      <Navbar />
      <NetworkSelector />
      
      <MainContent
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/create-property" element={<CreateProperty />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </MainContent>
      
      <Footer />
    </AppContainer>
  );
}

export default App;
