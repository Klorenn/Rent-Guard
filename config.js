require('dotenv').config();

const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  stellar: {
    network: process.env.STELLAR_NETWORK || 'testnet',
    horizonUrl: process.env.STELLAR_NETWORK === 'mainnet' 
      ? process.env.STELLAR_HORIZON_URL_MAINNET 
      : process.env.STELLAR_HORIZON_URL_TESTNET,
    testnetHorizonUrl: process.env.STELLAR_HORIZON_URL_TESTNET || 'https://horizon-testnet.stellar.org',
    mainnetHorizonUrl: process.env.STELLAR_HORIZON_URL_MAINNET || 'https://horizon.stellar.org'
  },
  
  security: {
    jwtSecret: process.env.JWT_SECRET || 'rentguard-super-secret-jwt-key-2024',
    encryptionKey: process.env.ENCRYPTION_KEY || 'rentguard-32-char-encryption-key'
  },
  
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000'
  }
};

module.exports = config;
