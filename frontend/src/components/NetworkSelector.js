import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, TestTube, Globe } from 'lucide-react';
import { useStellar } from '../context/StellarContext';

const SelectorContainer = styled.div`
  position: fixed;
  top: 90px;
  right: 2rem;
  z-index: 999;
  
  @media (max-width: 768px) {
    right: 1rem;
    top: 85px;
  }
`;

const SelectorButton = styled.button`
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: #ffffff;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 140px;
  
  &:hover {
    background: rgba(0, 212, 255, 0.2);
    border-color: rgba(0, 212, 255, 0.5);
  }
`;

const Dropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(15, 15, 35, 0.98);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  padding: 0.5rem;
  margin-top: 0.5rem;
  min-width: 200px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const NetworkOption = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: #ffffff;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
  text-align: left;
  
  &:hover {
    background: rgba(0, 212, 255, 0.1);
  }
`;

const NetworkIcon = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.network === 'mainnet' ? '#ff6b6b' : '#4ecdc4'};
`;

const NetworkInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
`;

const NetworkName = styled.span`
  font-weight: 600;
`;

const NetworkDescription = styled.span`
  font-size: 0.8rem;
  color: #888;
`;

const LoadingSpinner = styled(motion.div)`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0, 212, 255, 0.3);
  border-top: 2px solid #00d4ff;
  border-radius: 50%;
`;

function NetworkSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { network, switchNetwork, loading } = useStellar();

  const networks = [
    {
      id: 'testnet',
      name: 'Testnet',
      description: 'For testing and development',
      icon: <TestTube size={16} />
    },
    {
      id: 'mainnet',
      name: 'Mainnet',
      description: 'Live network with real funds',
      icon: <Globe size={16} />
    }
  ];

  const handleNetworkChange = async (newNetwork) => {
    if (newNetwork !== network) {
      await switchNetwork(newNetwork);
    }
    setIsOpen(false);
  };

  const currentNetwork = networks.find(n => n.id === network);

  return (
    <SelectorContainer>
      <SelectorButton onClick={() => setIsOpen(!isOpen)}>
        {loading ? (
          <LoadingSpinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <>
            <NetworkIcon network={network} />
            {currentNetwork?.name}
            <ChevronDown size={16} />
          </>
        )}
      </SelectorButton>

      <AnimatePresence>
        {isOpen && (
          <Dropdown
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {networks.map((net) => (
              <NetworkOption
                key={net.id}
                onClick={() => handleNetworkChange(net.id)}
                disabled={loading}
              >
                <NetworkIcon network={net.id} />
                <NetworkInfo>
                  <NetworkName>{net.name}</NetworkName>
                  <NetworkDescription>{net.description}</NetworkDescription>
                </NetworkInfo>
                {net.id === network && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ marginLeft: 'auto' }}
                  >
                    ✓
                  </motion.div>
                )}
              </NetworkOption>
            ))}
          </Dropdown>
        )}
      </AnimatePresence>
    </SelectorContainer>
  );
}

export default NetworkSelector;
