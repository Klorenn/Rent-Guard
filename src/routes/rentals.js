const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const stellarService = require('../services/stellarService');

// In-memory storage (replace with database in production)
let rentals = [];

// Validation schemas
const rentalSchema = Joi.object({
  propertyId: Joi.string().required(),
  tenantPublicKey: Joi.string().required(),
  landlordPublicKey: Joi.string().required(),
  monthlyRent: Joi.number().positive().required(),
  currency: Joi.string().valid('XLM', 'USD').default('XLM'),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
  deposit: Joi.number().min(0).optional(),
  terms: Joi.string().max(1000).optional()
});

const paymentSchema = Joi.object({
  rentalId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  sourceSecret: Joi.string().required(),
  memo: Joi.string().max(28).optional()
});

// GET /api/rentals - Get all rentals
router.get('/', (req, res) => {
  try {
    const { tenant, landlord, status } = req.query;
    
    let filteredRentals = [...rentals];
    
    if (tenant) {
      filteredRentals = filteredRentals.filter(r => r.tenantPublicKey === tenant);
    }
    
    if (landlord) {
      filteredRentals = filteredRentals.filter(r => r.landlordPublicKey === landlord);
    }
    
    if (status) {
      filteredRentals = filteredRentals.filter(r => r.status === status);
    }
    
    res.json({ success: true, rentals: filteredRentals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/rentals/:id - Get rental by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const rental = rentals.find(r => r.id === id);
    
    if (!rental) {
      return res.status(404).json({ success: false, error: 'Rental not found' });
    }
    
    res.json({ success: true, rental });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/rentals - Create new rental agreement
router.post('/', (req, res) => {
  try {
    const { error, value } = rentalSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        error: error.details[0].message 
      });
    }
    
    const rental = {
      id: uuidv4(),
      ...value,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      payments: []
    };
    
    rentals.push(rental);
    
    res.status(201).json({ success: true, rental });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/rentals/payment - Process rental payment
router.post('/payment', async (req, res) => {
  try {
    const { error, value } = paymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        error: error.details[0].message 
      });
    }
    
    const { rentalId, amount, sourceSecret, memo } = value;
    
    // Find rental
    const rental = rentals.find(r => r.id === rentalId);
    if (!rental) {
      return res.status(404).json({ success: false, error: 'Rental not found' });
    }
    
    // Create payment transaction
    const sourceKeypair = StellarSdk.Keypair.fromSecretKey(sourceSecret);
    const paymentMemo = memo || `Rent payment for ${rentalId}`;
    
    const transactionResult = await stellarService.createPaymentTransaction(
      sourceKeypair,
      rental.landlordPublicKey,
      amount,
      rental.currency,
      paymentMemo
    );
    
    if (!transactionResult.success) {
      return res.status(400).json(transactionResult);
    }
    
    // Submit transaction
    const submitResult = await stellarService.submitTransaction(transactionResult.transaction);
    
    if (!submitResult.success) {
      return res.status(400).json(submitResult);
    }
    
    // Record payment
    const payment = {
      id: uuidv4(),
      amount,
      currency: rental.currency,
      transactionHash: submitResult.result.hash,
      timestamp: new Date().toISOString(),
      memo: paymentMemo
    };
    
    rental.payments.push(payment);
    rental.updatedAt = new Date().toISOString();
    
    res.json({ 
      success: true, 
      payment,
      transaction: submitResult.result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/rentals/:id/status - Update rental status
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['active', 'terminated', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
      });
    }
    
    const rentalIndex = rentals.findIndex(r => r.id === id);
    if (rentalIndex === -1) {
      return res.status(404).json({ success: false, error: 'Rental not found' });
    }
    
    rentals[rentalIndex].status = status;
    rentals[rentalIndex].updatedAt = new Date().toISOString();
    
    res.json({ success: true, rental: rentals[rentalIndex] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/rentals/:id/payments - Get rental payments
router.get('/:id/payments', (req, res) => {
  try {
    const { id } = req.params;
    const rental = rentals.find(r => r.id === id);
    
    if (!rental) {
      return res.status(404).json({ success: false, error: 'Rental not found' });
    }
    
    res.json({ success: true, payments: rental.payments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
