const express = require('express');
const router = express.Router();
const stellarService = require('../services/stellarService');
const StellarSdk = require('stellar-sdk');
const Joi = require('joi');

// Validation schemas
const publicKeySchema = Joi.string().required().custom((value, helpers) => {
  if (!stellarService.isValidPublicKey(value)) {
    return helpers.error('any.invalid');
  }
  return value;
});

const paymentSchema = Joi.object({
  sourceSecret: Joi.string().required(),
  destinationPublicKey: Joi.string().required().custom((value, helpers) => {
    if (!stellarService.isValidPublicKey(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }),
  amount: Joi.number().positive().required(),
  asset: Joi.string().default('XLM'),
  memo: Joi.string().max(28).optional()
});

// GET /api/stellar/network - Get current network info
router.get('/network', (req, res) => {
  try {
    const networkInfo = stellarService.getNetworkInfo();
    res.json({ success: true, ...networkInfo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/stellar/network - Switch network
router.post('/network', (req, res) => {
  try {
    const { network } = req.body;
    
    if (!['testnet', 'mainnet'].includes(network)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Network must be either "testnet" or "mainnet"' 
      });
    }
    
    stellarService.switchNetwork(network);
    const networkInfo = stellarService.getNetworkInfo();
    
    res.json({ success: true, message: `Switched to ${network}`, ...networkInfo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/stellar/keypair - Generate new keypair
router.post('/keypair', (req, res) => {
  try {
    const keypair = stellarService.generateKeypair();
    res.json({
      success: true,
      publicKey: keypair.publicKey,
      secretKey: keypair.secretKey
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/stellar/account/:publicKey - Get account info
router.get('/account/:publicKey', async (req, res) => {
  try {
    const { publicKey } = req.params;
    
    const { error } = publicKeySchema.validate(publicKey);
    if (error) {
      return res.status(400).json({ success: false, error: 'Invalid public key' });
    }
    
    const accountResult = await stellarService.createAccount(publicKey);
    if (!accountResult.success) {
      return res.status(404).json(accountResult);
    }
    
    const balanceResult = await stellarService.getAccountBalance(publicKey);
    const transactionResult = await stellarService.getTransactionHistory(publicKey, 5);
    
    res.json({
      success: true,
      account: {
        publicKey,
        balances: balanceResult.balances || [],
        recentTransactions: transactionResult.transactions || []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/stellar/fund - Fund test account (testnet only)
router.post('/fund', async (req, res) => {
  try {
    const { publicKey } = req.body;
    
    const { error } = publicKeySchema.validate(publicKey);
    if (error) {
      return res.status(400).json({ success: false, error: 'Invalid public key' });
    }
    
    const result = await stellarService.fundTestAccount(publicKey);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/stellar/payment - Create payment transaction
router.post('/payment', async (req, res) => {
  try {
    const { error, value } = paymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        error: error.details[0].message 
      });
    }
    
    const { sourceSecret, destinationPublicKey, amount, asset, memo } = value;
    
    // Create keypair from secret
    const sourceKeypair = StellarSdk.Keypair.fromSecretKey(sourceSecret);
    
    const result = await stellarService.createPaymentTransaction(
      sourceKeypair,
      destinationPublicKey,
      amount,
      asset,
      memo
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/stellar/submit - Submit transaction
router.post('/submit', async (req, res) => {
  try {
    const { transactionXdr } = req.body;
    
    if (!transactionXdr) {
      return res.status(400).json({ 
        success: false, 
        error: 'Transaction XDR is required' 
      });
    }
    
    const result = await stellarService.submitTransaction(transactionXdr);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/stellar/transactions/:publicKey - Get transaction history
router.get('/transactions/:publicKey', async (req, res) => {
  try {
    const { publicKey } = req.params;
    const { limit = 10 } = req.query;
    
    const { error } = publicKeySchema.validate(publicKey);
    if (error) {
      return res.status(400).json({ success: false, error: 'Invalid public key' });
    }
    
    const result = await stellarService.getTransactionHistory(publicKey, parseInt(limit));
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
