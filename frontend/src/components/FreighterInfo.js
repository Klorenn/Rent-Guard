import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ExternalLink, Download, CheckCircle, AlertCircle } from 'lucide-react';

const InfoContainer = styled(motion.div)`
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 168, 204, 0.1));
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #00d4ff, #00a8cc);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const InfoTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const InfoDescription = styled.p`
  color: #cccccc;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(0, 212, 255, 0.2);
`;

const FeatureIcon = styled.div`
  color: #4ecdc4;
  font-size: 1.2rem;
`;

const FeatureText = styled.div`
  color: #ffffff;
  font-weight: 500;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const InstallButton = styled.a`
  background: linear-gradient(135deg, #00d4ff, #00a8cc);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
  }
`;

const LearnMoreButton = styled.a`
  background: transparent;
  color: #00d4ff;
  padding: 0.75rem 1.5rem;
  border: 2px solid #00d4ff;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 212, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const TestnetInfo = styled.div`
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1.5rem;
`;

const TestnetTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffc107;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const TestnetText = styled.div`
  color: #ffc107;
  font-size: 0.9rem;
  line-height: 1.5;
`;

function FreighterInfo() {
  return (
    <InfoContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <InfoHeader>
        <InfoIcon>🔗</InfoIcon>
        <InfoTitle>Connect with Freighter Wallet</InfoTitle>
      </InfoHeader>
      
      <InfoDescription>
        Freighter is the official Stellar wallet extension for browsers. It provides a secure and easy way to interact with Stellar applications without exposing your private keys.
      </InfoDescription>
      
      <FeaturesList>
        <FeatureItem>
          <FeatureIcon>🔐</FeatureIcon>
          <FeatureText>Secure key management</FeatureText>
        </FeatureItem>
        <FeatureItem>
          <FeatureIcon>⚡</FeatureIcon>
          <FeatureText>One-click transactions</FeatureText>
        </FeatureItem>
        <FeatureItem>
          <FeatureIcon>🌐</FeatureIcon>
          <FeatureText>Multi-network support</FeatureText>
        </FeatureItem>
        <FeatureItem>
          <FeatureIcon>🛡️</FeatureIcon>
          <FeatureText>Built-in security</FeatureText>
        </FeatureItem>
      </FeaturesList>
      
      <ActionButtons>
        <InstallButton 
          href="https://freighter.app/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Download size={18} />
          Install Freighter
        </InstallButton>
        
        <LearnMoreButton 
          href="https://developers.stellar.org/docs/tools/freighter" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <ExternalLink size={18} />
          Learn More
        </LearnMoreButton>
      </ActionButtons>
      
      <TestnetInfo>
        <TestnetTitle>
          <AlertCircle size={16} />
          Testnet Ready
        </TestnetTitle>
        <TestnetText>
          Freighter automatically supports Stellar testnet. You can create test accounts and receive free test XLM directly from the wallet interface.
        </TestnetText>
      </TestnetInfo>
    </InfoContainer>
  );
}

export default FreighterInfo;
