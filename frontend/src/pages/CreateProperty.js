import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  MapPin, 
  DollarSign, 
  FileText, 
  Upload,
  Plus,
  X,
  Save
} from 'lucide-react';
import { useStellar } from '../context/StellarContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #cccccc;
`;

const Form = styled.form`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  color: #cccccc;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #ffffff;
  font-size: 1rem;
  
  &::placeholder {
    color: #888;
  }
  
  &:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #ffffff;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  
  &::placeholder {
    color: #888;
  }
  
  &:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }
  
  option {
    background: #1a1a2e;
    color: #ffffff;
  }
`;

const FeaturesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const FeatureTag = styled.div`
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: #00d4ff;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  
  &:hover {
    background: rgba(255, 107, 107, 0.1);
  }
`;

const FeatureInput = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const AddFeatureButton = styled.button`
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: #00d4ff;
  padding: 0.75rem 1rem;
  border-radius: 8px;
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

const ImageUpload = styled.div`
  border: 2px dashed rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: #888;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(0, 212, 255, 0.5);
    color: #00d4ff;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border: none;
  
  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #00d4ff, #00a8cc);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
    }
  ` : `
    background: transparent;
    color: #888;
    border: 1px solid #333;
    
    &:hover {
      color: #ffffff;
      border-color: #555;
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled(motion.div)`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 212, 255, 0.3);
  border-top: 2px solid #00d4ff;
  border-radius: 50%;
`;

function CreateProperty() {
  const navigate = useNavigate();
  const { wallet } = useStellar();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    monthlyRent: '',
    currency: 'XLM',
    features: []
  });
  const [newFeature, setNewFeature] = useState('');

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (featureToRemove) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!wallet) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!formData.title || !formData.description || !formData.address || !formData.monthlyRent) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const propertyData = {
        ...formData,
        monthlyRent: parseFloat(formData.monthlyRent),
        landlordPublicKey: wallet.publicKey,
        isAvailable: true
      };

      const response = await axios.post(`${API_BASE}/properties`, propertyData);
      
      if (response.data.success) {
        toast.success('Property created successfully!');
        navigate('/properties');
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(`Failed to create property: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!wallet) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#888' }}>
          <Building size={60} style={{ marginBottom: '1rem', color: '#00d4ff' }} />
          <h3>Connect Your Wallet</h3>
          <p>Please connect your wallet to create a property listing.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Create Property</Title>
        <Subtitle>List your property for rent on the blockchain</Subtitle>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>
            <Building size={20} />
            Basic Information
          </SectionTitle>
          
          <FormGroup>
            <Label>Property Title *</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Modern Downtown Apartment"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Description *</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your property, its features, and what makes it special..."
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Address *</Label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Full property address"
              required
            />
          </FormGroup>
        </FormSection>

        <FormSection>
          <SectionTitle>
            <DollarSign size={20} />
            Pricing
          </SectionTitle>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <FormGroup>
              <Label>Monthly Rent *</Label>
              <Input
                type="number"
                name="monthlyRent"
                value={formData.monthlyRent}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.0000001"
                min="0"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Currency</Label>
              <Select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
              >
                <option value="XLM">XLM</option>
                <option value="USD">USD</option>
              </Select>
            </FormGroup>
          </div>
        </FormSection>

        <FormSection>
          <SectionTitle>
            <FileText size={20} />
            Features
          </SectionTitle>
          
          <FeaturesContainer>
            {formData.features.map((feature, index) => (
              <FeatureTag key={index}>
                {feature}
                <RemoveButton onClick={() => handleRemoveFeature(feature)}>
                  <X size={14} />
                </RemoveButton>
              </FeatureTag>
            ))}
          </FeaturesContainer>

          <FeatureInput>
            <Input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a feature (e.g., Air conditioning, Parking, Pet friendly)"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
            />
            <AddFeatureButton type="button" onClick={handleAddFeature}>
              <Plus size={16} />
              Add
            </AddFeatureButton>
          </FeatureInput>
        </FormSection>

        <FormSection>
          <SectionTitle>
            <Upload size={20} />
            Images
          </SectionTitle>
          
          <ImageUpload>
            <Upload size={40} style={{ marginBottom: '1rem' }} />
            <div>Click to upload property images</div>
            <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              (Image upload functionality coming soon)
            </div>
          </ImageUpload>
        </FormSection>

        <FormActions>
          <Button type="button" onClick={() => navigate('/properties')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? (
              <LoadingSpinner
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <>
                <Save size={18} />
                Create Property
              </>
            )}
          </Button>
        </FormActions>
      </Form>
    </Container>
  );
}

export default CreateProperty;
