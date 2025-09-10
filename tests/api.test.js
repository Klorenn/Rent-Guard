const request = require('supertest');
const express = require('express');
const cors = require('cors');
const config = require('../config');

// Create a test app without starting the server
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const stellarRoutes = require('../src/routes/stellar');
const propertyRoutes = require('../src/routes/properties');
const rentalRoutes = require('../src/routes/rentals');

// Use routes
app.use('/api/stellar', stellarRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/rentals', rentalRoutes);

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    network: config.stellar.network
  });
});

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('network');
    });
  });

  describe('GET /api/stellar/network', () => {
    it('should return network information', async () => {
      const response = await request(app)
        .get('/api/stellar/network')
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('network');
      expect(response.body).toHaveProperty('horizonUrl');
    });
  });

  describe('POST /api/stellar/keypair', () => {
    it('should generate a new keypair', async () => {
      const response = await request(app)
        .post('/api/stellar/keypair')
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('publicKey');
      expect(response.body).toHaveProperty('secretKey');
    });
  });

  describe('POST /api/stellar/network', () => {
    it('should switch to testnet', async () => {
      const response = await request(app)
        .post('/api/stellar/network')
        .send({ network: 'testnet' })
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('network', 'testnet');
    });

    it('should switch to mainnet', async () => {
      const response = await request(app)
        .post('/api/stellar/network')
        .send({ network: 'mainnet' })
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('network', 'mainnet');
    });

    it('should reject invalid network', async () => {
      const response = await request(app)
        .post('/api/stellar/network')
        .send({ network: 'invalid' })
        .expect(400);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/properties', () => {
    it('should return empty properties list', async () => {
      const response = await request(app)
        .get('/api/properties')
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('properties');
      expect(Array.isArray(response.body.properties)).toBe(true);
    });

    it('should filter by available properties', async () => {
      const response = await request(app)
        .get('/api/properties?available=true')
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('properties');
    });
  });

  describe('POST /api/properties', () => {
    it('should create a new property', async () => {
      const propertyData = {
        title: 'Test Property',
        description: 'A beautiful test property',
        address: '123 Test Street',
        monthlyRent: 100,
        currency: 'XLM',
        landlordPublicKey: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
      };

      const response = await request(app)
        .post('/api/properties')
        .send(propertyData)
        .expect(201);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('property');
      expect(response.body.property).toHaveProperty('id');
      expect(response.body.property).toHaveProperty('title', propertyData.title);
    });

    it('should reject invalid property data', async () => {
      const invalidData = {
        title: 'Test',
        description: 'Short'
      };

      const response = await request(app)
        .post('/api/properties')
        .send(invalidData)
        .expect(400);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/rentals', () => {
    it('should return empty rentals list', async () => {
      const response = await request(app)
        .get('/api/rentals')
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('rentals');
      expect(Array.isArray(response.body.rentals)).toBe(true);
    });
  });

  describe('POST /api/rentals', () => {
    it('should create a new rental agreement', async () => {
      const rentalData = {
        propertyId: 'test-property-id',
        tenantPublicKey: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
        landlordPublicKey: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
        monthlyRent: 100,
        currency: 'XLM',
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      };

      const response = await request(app)
        .post('/api/rentals')
        .send(rentalData)
        .expect(201);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('rental');
      expect(response.body.rental).toHaveProperty('id');
      expect(response.body.rental).toHaveProperty('status', 'active');
    });
  });
});
