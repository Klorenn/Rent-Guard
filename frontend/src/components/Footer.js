import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Building, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  Globe,
  Shield,
  Zap
} from 'lucide-react';

const FooterContainer = styled.footer`
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 212, 255, 0.2);
  padding: 3rem 2rem 2rem;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FooterLink = styled.a`
  color: #cccccc;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #00d4ff;
  }
`;

const FooterText = styled.p`
  color: #888;
  line-height: 1.6;
  margin: 0;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00d4ff;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 212, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 212, 255, 0.2);
  }
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #cccccc;
  font-size: 0.9rem;
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(0, 212, 255, 0.1);
  padding-top: 2rem;
  text-align: center;
  color: #888;
  font-size: 0.9rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #00d4ff;
  margin-bottom: 1rem;
`;

const NetworkInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 20px;
  font-size: 0.8rem;
  color: #00d4ff;
  margin-bottom: 1rem;
  display: inline-flex;
`;

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <Logo>
            <Building size={24} />
            RentGuard
          </Logo>
          <FooterText>
            Revolutionizing rental property management with blockchain technology. 
            Secure, transparent, and efficient rental payments powered by Stellar.
          </FooterText>
          <SocialLinks>
            <SocialLink href="https://github.com/Klorenn/Rent-Guard" target="_blank" rel="noopener noreferrer">
              <Github size={18} />
            </SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <Twitter size={18} />
            </SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <Linkedin size={18} />
            </SocialLink>
            <SocialLink href="mailto:contact@rentguard.com">
              <Mail size={18} />
            </SocialLink>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Platform</FooterTitle>
          <FooterLink href="/properties">Properties</FooterLink>
          <FooterLink href="/rentals">Rentals</FooterLink>
          <FooterLink href="/dashboard">Dashboard</FooterLink>
          <FooterLink href="/wallet">Wallet</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Features</FooterTitle>
          <FeatureList>
            <FeatureItem>
              <Shield size={16} />
              Secure Payments
            </FeatureItem>
            <FeatureItem>
              <Zap size={16} />
              Instant Transactions
            </FeatureItem>
            <FeatureItem>
              <Globe size={16} />
              Global Access
            </FeatureItem>
            <FeatureItem>
              <Building size={16} />
              Property Management
            </FeatureItem>
          </FeatureList>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Support</FooterTitle>
          <FooterLink href="#">Documentation</FooterLink>
          <FooterLink href="#">API Reference</FooterLink>
          <FooterLink href="#">Help Center</FooterLink>
          <FooterLink href="#">Contact Us</FooterLink>
          <NetworkInfo>
            <Globe size={14} />
            Stellar Testnet
          </NetworkInfo>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <p>&copy; {currentYear} RentGuard. All rights reserved.</p>
        <p style={{ marginTop: '0.5rem' }}>
          Built with ❤️ using Stellar blockchain technology
        </p>
      </FooterBottom>
    </FooterContainer>
  );
}

export default Footer;
