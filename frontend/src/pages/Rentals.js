import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  User, 
  Building, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Edit
} from 'lucide-react';
import { useStellar } from '../context/StellarContext';
import axios from 'axios';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

const CreateButton = styled.button`
  background: linear-gradient(135deg, #00d4ff, #00a8cc);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
  }
`;

const RentalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const RentalCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 212, 255, 0.4);
    box-shadow: 0 10px 30px rgba(0, 212, 255, 0.1);
  }
`;

const RentalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const RentalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
`;

const StatusBadge = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
      case 'active': return '#4ecdc4';
      case 'terminated': return '#ff6b6b';
      case 'completed': return '#95a5a6';
      default: return '#888';
    }
  }};
  color: white;
  text-transform: capitalize;
`;

const RentalInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoLabel = styled.div`
  font-size: 0.8rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: #ffffff;
  font-weight: 500;
`;

const RentalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  flex: 1;
  background: ${props => props.variant === 'primary' 
    ? 'linear-gradient(135deg, #00d4ff, #00a8cc)' 
    : 'transparent'
  };
  color: ${props => props.variant === 'primary' ? 'white' : '#00d4ff'};
  border: ${props => props.variant === 'primary' ? 'none' : '1px solid #00d4ff'};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 120px;
  
  &:hover {
    transform: translateY(-1px);
    ${props => props.variant === 'primary' 
      ? 'box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);'
      : 'background: rgba(0, 212, 255, 0.1);'
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #888;
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: #00d4ff;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.1rem;
  color: #888;
`;

const PaymentHistory = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  margin-top: 2rem;
`;

const PaymentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const PaymentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PaymentAmount = styled.div`
  font-weight: 600;
  color: #4ecdc4;
`;

const PaymentDate = styled.div`
  font-size: 0.9rem;
  color: #888;
`;

function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { wallet } = useStellar();

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (wallet) {
        params.append('tenant', wallet.publicKey);
      }
      
      const response = await axios.get(`${API_BASE}/rentals?${params}`);
      setRentals(response.data.rentals || []);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (amount, currency) => {
    return `${amount} ${currency}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} />;
      case 'terminated':
        return <AlertCircle size={16} />;
      case 'completed':
        return <Clock size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <div>Loading rentals...</div>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Rentals</Title>
        <CreateButton>
          <Plus size={18} />
          New Rental Agreement
        </CreateButton>
      </Header>

      {rentals.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <FileText size={40} />
          </EmptyIcon>
          <h3>No rentals found</h3>
          <p>You don't have any rental agreements yet. Create one to get started.</p>
        </EmptyState>
      ) : (
        <>
          <RentalsGrid>
            {rentals.map((rental, index) => (
              <RentalCard
                key={rental.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <RentalHeader>
                  <RentalTitle>Rental #{rental.id.slice(0, 8)}</RentalTitle>
                  <StatusBadge status={rental.status}>
                    {getStatusIcon(rental.status)}
                    {rental.status}
                  </StatusBadge>
                </RentalHeader>

                <RentalInfo>
                  <InfoItem>
                    <InfoLabel>Property</InfoLabel>
                    <InfoValue>Property #{rental.propertyId.slice(0, 8)}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Monthly Rent</InfoLabel>
                    <InfoValue>{formatPrice(rental.monthlyRent, rental.currency)}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Start Date</InfoLabel>
                    <InfoValue>{formatDate(rental.startDate)}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>End Date</InfoLabel>
                    <InfoValue>{formatDate(rental.endDate)}</InfoValue>
                  </InfoItem>
                </RentalInfo>

                <RentalActions>
                  <ActionButton>
                    <Eye size={16} />
                    View Details
                  </ActionButton>
                  <ActionButton variant="primary">
                    <DollarSign size={16} />
                    Make Payment
                  </ActionButton>
                </RentalActions>

                {rental.payments && rental.payments.length > 0 && (
                  <PaymentHistory>
                    <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>Recent Payments</h4>
                    {rental.payments.slice(0, 3).map((payment, paymentIndex) => (
                      <PaymentItem key={paymentIndex}>
                        <PaymentInfo>
                          <PaymentAmount>{formatPrice(payment.amount, payment.currency)}</PaymentAmount>
                          <PaymentDate>{formatDate(payment.timestamp)}</PaymentDate>
                        </PaymentInfo>
                        <div style={{ color: '#4ecdc4', fontSize: '0.9rem' }}>
                          ✓ Paid
                        </div>
                      </PaymentItem>
                    ))}
                  </PaymentHistory>
                )}
              </RentalCard>
            ))}
          </RentalsGrid>
        </>
      )}
    </Container>
  );
}

export default Rentals;
