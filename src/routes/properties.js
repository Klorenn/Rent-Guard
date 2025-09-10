const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

// In-memory storage (replace with database in production)
let properties = [];

// Validation schemas
const propertySchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  address: Joi.string().min(5).max(200).required(),
  monthlyRent: Joi.number().positive().required(),
  currency: Joi.string().valid('XLM', 'USD').default('XLM'),
  landlordPublicKey: Joi.string().required(),
  images: Joi.array().items(Joi.string().uri()).max(10).optional(),
  features: Joi.array().items(Joi.string()).optional(),
  isAvailable: Joi.boolean().default(true)
});

const updatePropertySchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().min(10).max(1000).optional(),
  address: Joi.string().min(5).max(200).optional(),
  monthlyRent: Joi.number().positive().optional(),
  currency: Joi.string().valid('XLM', 'USD').optional(),
  images: Joi.array().items(Joi.string().uri()).max(10).optional(),
  features: Joi.array().items(Joi.string()).optional(),
  isAvailable: Joi.boolean().optional()
});

// GET /api/properties - Get all properties
router.get('/', (req, res) => {
  try {
    const { available, landlord, search } = req.query;
    
    let filteredProperties = [...properties];
    
    if (available === 'true') {
      filteredProperties = filteredProperties.filter(p => p.isAvailable);
    }
    
    if (landlord) {
      filteredProperties = filteredProperties.filter(p => p.landlordPublicKey === landlord);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProperties = filteredProperties.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.address.toLowerCase().includes(searchLower)
      );
    }
    
    res.json({ success: true, properties: filteredProperties });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/properties/:id - Get property by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const property = properties.find(p => p.id === id);
    
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    
    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/properties - Create new property
router.post('/', (req, res) => {
  try {
    const { error, value } = propertySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        error: error.details[0].message 
      });
    }
    
    const property = {
      id: uuidv4(),
      ...value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    properties.push(property);
    
    res.status(201).json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/properties/:id - Update property
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const propertyIndex = properties.findIndex(p => p.id === id);
    
    if (propertyIndex === -1) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    
    const { error, value } = updatePropertySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        error: error.details[0].message 
      });
    }
    
    properties[propertyIndex] = {
      ...properties[propertyIndex],
      ...value,
      updatedAt: new Date().toISOString()
    };
    
    res.json({ success: true, property: properties[propertyIndex] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/properties/:id - Delete property
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const propertyIndex = properties.findIndex(p => p.id === id);
    
    if (propertyIndex === -1) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    
    properties.splice(propertyIndex, 1);
    
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
