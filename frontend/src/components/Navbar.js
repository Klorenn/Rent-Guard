import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Menu, X, Wallet, Home, Building, FileText, User } from 'lucide-react';
import { useStellar } from '../context/StellarContext';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
  padding: 0 2rem;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #00d4ff;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #00a8cc;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    background: rgba(15, 15, 35, 0.98);
    backdrop-filter: blur(10px);
    flex-direction: column;
    padding: 2rem;
    gap: 1rem;
    border-bottom: 1px solid rgba(0, 212, 255, 0.2);
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.active ? '#00d4ff' : '#ffffff'};
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #00d4ff;
    background: rgba(0, 212, 255, 0.1);
  }
`;

const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(0, 212, 255, 0.3);
`;

const WalletAddress = styled.span`
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #00d4ff;
`;

const ConnectButton = styled.button`
  background: linear-gradient(135deg, #00d4ff, #00a8cc);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 0.5rem;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const NetworkBadge = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => props.network === 'mainnet' ? '#ff6b6b' : '#4ecdc4'};
  color: white;
`;

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { wallet, account, connectWallet, disconnectWallet, network } = useStellar();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Nav>
      <Logo to="/">
        <Building size={24} />
        RentGuard
      </Logo>

      <NavLinks isOpen={isMenuOpen}>
        <NavLink to="/" active={location.pathname === '/'}>
          <Home size={18} />
          Home
        </NavLink>
        <NavLink to="/properties" active={location.pathname === '/properties'}>
          <Building size={18} />
          Properties
        </NavLink>
        <NavLink to="/rentals" active={location.pathname === '/rentals'}>
          <FileText size={18} />
          Rentals
        </NavLink>
        <NavLink to="/dashboard" active={location.pathname === '/dashboard'}>
          <User size={18} />
          Dashboard
        </NavLink>
        
        {wallet ? (
          <WalletInfo>
            <Wallet size={18} />
            <WalletAddress>{formatAddress(wallet.publicKey)}</WalletAddress>
            <NetworkBadge network={network}>{network}</NetworkBadge>
            <button onClick={disconnectWallet} style={{ 
              background: 'none', 
              border: 'none', 
              color: '#ff6b6b', 
              cursor: 'pointer',
              padding: '0.25rem'
            }}>
              <X size={16} />
            </button>
          </WalletInfo>
        ) : (
          <ConnectButton onClick={() => connectWallet('')}>
            <Wallet size={18} />
            Connect Wallet
          </ConnectButton>
        )}
      </NavLinks>

      <MobileMenuButton onClick={toggleMenu}>
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </MobileMenuButton>
    </Nav>
  );
}

export default Navbar;
