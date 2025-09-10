import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Square,
  Calendar,
  User,
  Star,
  Heart,
  Share2,
  MessageCircle,
  Building
} from 'lucide-react';
import axios from 'axios';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const BackButton = styled.button`
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: #00d4ff;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
  
  &:hover {
    background: rgba(0, 212, 255, 0.2);
  }
`;

const PropertyHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PropertyImage = styled.div`
  height: 400px;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 1.1rem;
  position: relative;
  overflow: hidden;
`;

const PropertyInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
`;

const PropertyTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
`;

const PropertyLocation = styled.div`
  color: #888;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const PropertyPrice = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #00d4ff;
  margin-bottom: 0.5rem;
`;

const PricePeriod = styled.div`
  color: #888;
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const PropertyFeatures = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #cccccc;
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #00d4ff, #00a8cc);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: #00d4ff;
  padding: 0.75rem 1.5rem;
  border: 2px solid #00d4ff;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 212, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const PropertyDetails = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailsSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1.5rem;
`;

const Description = styled.p`
  color: #cccccc;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #cccccc;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;

const LandlordInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
`;

const LandlordHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const LandlordAvatar = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #00d4ff, #00a8cc);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.5rem;
`;

const LandlordName = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.25rem;
`;

const LandlordRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #ffd700;
  font-size: 0.9rem;
`;

const ContactButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #00d4ff, #00a8cc);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.1rem;
  color: #888;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #ff6b6b;
`;

function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/properties/${id}`);
      setProperty(response.data.property);
    } catch (error) {
      setError('Property not found');
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount, currency) => {
    return `${amount} ${currency}`;
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <div>Loading property details...</div>
        </LoadingContainer>
      </Container>
    );
  }

  if (error || !property) {
    return (
      <Container>
        <ErrorContainer>
          <h3>Property Not Found</h3>
          <p>The property you're looking for doesn't exist or has been removed.</p>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        Back to Properties
      </BackButton>

      <PropertyHeader>
        <PropertyImage>
          <div style={{ textAlign: 'center' }}>
            <Building size={60} />
            <div style={{ marginTop: '1rem' }}>Property Image</div>
          </div>
        </PropertyImage>

        <PropertyInfo>
          <PropertyTitle>{property.title}</PropertyTitle>
          <PropertyLocation>
            <MapPin size={18} />
            {property.address}
          </PropertyLocation>
          <PropertyPrice>{formatPrice(property.monthlyRent, property.currency)}</PropertyPrice>
          <PricePeriod>per month</PricePeriod>

          <PropertyFeatures>
            <Feature>
              <Bed size={18} />
              3 beds
            </Feature>
            <Feature>
              <Bath size={18} />
              2 baths
            </Feature>
            <Feature>
              <Square size={18} />
              1200 sqft
            </Feature>
          </PropertyFeatures>

          <ActionButtons>
            <PrimaryButton>
              <Calendar size={20} />
              Rent Now
            </PrimaryButton>
            <SecondaryButton>
              <MessageCircle size={18} />
              Contact Landlord
            </SecondaryButton>
          </ActionButtons>
        </PropertyInfo>
      </PropertyHeader>

      <PropertyDetails>
        <DetailsSection>
          <SectionTitle>About This Property</SectionTitle>
          <Description>{property.description}</Description>

          <SectionTitle>Features</SectionTitle>
          <FeaturesList>
            {property.features?.map((feature, index) => (
              <FeatureItem key={index}>
                <Star size={16} />
                {feature}
              </FeatureItem>
            )) || (
              <FeatureItem>
                <Star size={16} />
                Modern kitchen
              </FeatureItem>
            )}
            <FeatureItem>
              <Star size={16} />
              Air conditioning
            </FeatureItem>
            <FeatureItem>
              <Star size={16} />
              Parking space
            </FeatureItem>
            <FeatureItem>
              <Star size={16} />
              Pet friendly
            </FeatureItem>
          </FeaturesList>
        </DetailsSection>

        <LandlordInfo>
          <SectionTitle>Landlord</SectionTitle>
          <LandlordHeader>
            <LandlordAvatar>
              {property.landlordPublicKey?.slice(0, 2).toUpperCase() || 'L'}
            </LandlordAvatar>
            <div>
              <LandlordName>Landlord</LandlordName>
              <LandlordRating>
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <span style={{ color: '#888', marginLeft: '0.5rem' }}>5.0</span>
              </LandlordRating>
            </div>
          </LandlordHeader>
          <ContactButton>
            <MessageCircle size={18} />
            Contact Landlord
          </ContactButton>
        </LandlordInfo>
      </PropertyDetails>
    </Container>
  );
}

export default PropertyDetail;
