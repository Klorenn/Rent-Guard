const StellarSdk = require('stellar-sdk');

// Mock Stellar SDK for testing
jest.mock('stellar-sdk');

describe('Stellar Service', () => {
  let stellarService;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock StellarSdk
    StellarSdk.Keypair = {
      random: jest.fn(() => ({
        publicKey: jest.fn(() => 'TEST_PUBLIC_KEY'),
        secret: jest.fn(() => 'TEST_SECRET_KEY')
      })),
      fromSecret: jest.fn(() => ({
        publicKey: jest.fn(() => 'TEST_PUBLIC_KEY')
      })),
      fromPublicKey: jest.fn(() => ({}))
    };
    
    StellarSdk.Server = jest.fn(() => ({
      loadAccount: jest.fn(),
      submitTransaction: jest.fn(),
      transactions: jest.fn(() => ({
        forAccount: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => ({
              call: jest.fn(() => Promise.resolve({ records: [] }))
            }))
          }))
        }))
      }))
    }));
    
    StellarSdk.Networks = {
      usePublicNetwork: jest.fn(),
      useTestNetwork: jest.fn(),
      PUBLIC: 'public',
      TESTNET: 'testnet'
    };
    
    StellarSdk.Asset = {
      native: jest.fn(() => 'XLM')
    };
    
    StellarSdk.TransactionBuilder = {
      fromXDR: jest.fn(() => ({})),
      fromXDR: jest.fn(() => ({}))
    };
    
    // Import service after mocking
    stellarService = require('../src/services/stellarService');
  });

  describe('generateKeypair', () => {
    it('should generate a new keypair', () => {
      const keypair = stellarService.generateKeypair();
      
      expect(StellarSdk.Keypair.random).toHaveBeenCalled();
      expect(keypair).toHaveProperty('publicKey');
      expect(keypair).toHaveProperty('secretKey');
    });
  });

  describe('isValidPublicKey', () => {
    it('should validate correct public key', () => {
      const validKey = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
      
      const result = stellarService.isValidPublicKey(validKey);
      
      expect(result).toBe(true);
      expect(StellarSdk.Keypair.fromPublicKey).toHaveBeenCalledWith(validKey);
    });

    it('should reject invalid public key', () => {
      StellarSdk.Keypair.fromPublicKey.mockImplementation(() => {
        throw new Error('Invalid key');
      });
      
      const invalidKey = 'invalid_key';
      
      const result = stellarService.isValidPublicKey(invalidKey);
      
      expect(result).toBe(false);
    });
  });

  describe('switchNetwork', () => {
    it('should switch to testnet', () => {
      stellarService.switchNetwork('testnet');
      
      expect(stellarService.network).toBe('testnet');
      expect(stellarService.networkPassphrase).toBe(StellarSdk.Networks.TESTNET);
    });

    it('should switch to mainnet', () => {
      stellarService.switchNetwork('mainnet');
      
      expect(stellarService.network).toBe('mainnet');
      expect(stellarService.networkPassphrase).toBe(StellarSdk.Networks.PUBLIC);
    });
  });

  describe('getNetworkInfo', () => {
    it('should return network information', () => {
      const networkInfo = stellarService.getNetworkInfo();
      
      expect(networkInfo).toHaveProperty('network');
      expect(networkInfo).toHaveProperty('horizonUrl');
      expect(networkInfo).toHaveProperty('passphrase');
    });
  });
});
