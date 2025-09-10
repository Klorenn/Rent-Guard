import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Square,
  Star,
  Eye,
  Building
} from 'lucide-react';
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

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  color: #ffffff;
  font-size: 1rem;
  min-width: 300px;
  
  &::placeholder {
    color: #888;
  }
  
  &:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }
`;

const FilterButton = styled.button`
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
  
  &:hover {
    background: rgba(0, 212, 255, 0.2);
  }
`;

const CreateButton = styled(Link)`
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

const PropertiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const PropertyCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 212, 255, 0.4);
    box-shadow: 0 10px 30px rgba(0, 212, 255, 0.1);
  }
`;

const PropertyImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 0.9rem;
  position: relative;
  overflow: hidden;
`;

const PropertyBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => props.available ? '#4ecdc4' : '#ff6b6b'};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const PropertyContent = styled.div`
  padding: 1.5rem;
`;

const PropertyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const PropertyLocation = styled.div`
  color: #888;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
`;

const PropertyPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #00d4ff;
  margin-bottom: 1rem;
`;

const PropertyFeatures = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #888;
  font-size: 0.9rem;
`;

const PropertyActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled(Link)`
  flex: 1;
  background: ${props => props.primary ? 'linear-gradient(135deg, #00d4ff, #00a8cc)' : 'transparent'};
  color: ${props => props.primary ? 'white' : '#00d4ff'};
  border: ${props => props.primary ? 'none' : '1px solid #00d4ff'};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-1px);
    ${props => props.primary 
      ? 'box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);'
      : 'background: rgba(0, 212, 255, 0.1);'
    }
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

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailable, setFilterAvailable] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterAvailable) params.append('available', 'true');
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await axios.get(`${API_BASE}/properties?${params}`);
      setProperties(response.data.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      fetchProperties();
    }, 500);
  };

  const toggleFilter = () => {
    setFilterAvailable(!filterAvailable);
    // Trigger refetch after state update
    setTimeout(fetchProperties, 0);
  };

  const formatPrice = (amount, currency) => {
    return `${amount} ${currency}`;
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <div>Loading properties...</div>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Properties</Title>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <FilterButton onClick={toggleFilter}>
            <Filter size={18} />
            {filterAvailable ? 'All' : 'Available'}
          </FilterButton>
          <CreateButton to="/create-property">
            <Plus size={18} />
            Add Property
          </CreateButton>
        </SearchContainer>
      </Header>

      {properties.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <Building size={40} />
          </EmptyIcon>
          <h3>No properties found</h3>
          <p>Start by adding your first property or adjust your search criteria.</p>
        </EmptyState>
      ) : (
        <PropertiesGrid>
          {properties.map((property, index) => (
            <PropertyCard
              key={property.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <PropertyImage>
                <Building size={60} />
                <PropertyBadge available={property.isAvailable}>
                  {property.isAvailable ? 'Available' : 'Rented'}
                </PropertyBadge>
              </PropertyImage>
              
              <PropertyContent>
                <PropertyTitle>{property.title}</PropertyTitle>
                <PropertyLocation>
                  <MapPin size={16} />
                  {property.address}
                </PropertyLocation>
                <PropertyPrice>
                  {formatPrice(property.monthlyRent, property.currency)}
                  <span style={{ fontSize: '0.9rem', color: '#888', marginLeft: '0.5rem' }}>
                    /month
                  </span>
                </PropertyPrice>
                
                <PropertyFeatures>
                  <Feature>
                    <Bed size={16} />
                    3 beds
                  </Feature>
                  <Feature>
                    <Bath size={16} />
                    2 baths
                  </Feature>
                  <Feature>
                    <Square size={16} />
                    1200 sqft
                  </Feature>
                </PropertyFeatures>
                
                <PropertyActions>
                  <ActionButton to={`/properties/${property.id}`}>
                    <Eye size={16} />
                    View
                  </ActionButton>
                  <ActionButton primary to={`/properties/${property.id}`}>
                    Rent Now
                  </ActionButton>
                </PropertyActions>
              </PropertyContent>
            </PropertyCard>
          ))}
        </PropertiesGrid>
      )}
    </Container>
  );
}

export default Properties;
