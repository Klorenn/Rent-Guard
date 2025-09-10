// Freighter Wallet Integration Service
class FreighterService {
  constructor() {
    this.isAvailable = false;
    this.checkAvailability();
  }

  // Check if Freighter is available
  async checkAvailability() {
    try {
      if (typeof window !== 'undefined' && window.freighterApi) {
        this.isAvailable = true;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Freighter not available:', error);
      return false;
    }
  }

  // Get user's public key
  async getPublicKey() {
    try {
      if (!this.isAvailable) {
        throw new Error('Freighter not available');
      }

      const publicKey = await window.freighterApi.getPublicKey();
      return publicKey;
    } catch (error) {
      throw new Error(`Failed to get public key: ${error.message}`);
    }
  }

  // Get user's network
  async getNetwork() {
    try {
      if (!this.isAvailable) {
        throw new Error('Freighter not available');
      }

      const network = await window.freighterApi.getNetwork();
      return network;
    } catch (error) {
      throw new Error(`Failed to get network: ${error.message}`);
    }
  }

  // Sign transaction
  async signTransaction(xdr, network) {
    try {
      if (!this.isAvailable) {
        throw new Error('Freighter not available');
      }

      const signedXdr = await window.freighterApi.signTransaction(xdr, {
        network,
        accountToSign: await this.getPublicKey()
      });

      return signedXdr;
    } catch (error) {
      throw new Error(`Failed to sign transaction: ${error.message}`);
    }
  }

  // Set allowed domains
  async setAllowedDomains(domains) {
    try {
      if (!this.isAvailable) {
        throw new Error('Freighter not available');
      }

      await window.freighterApi.setAllowedDomains(domains);
    } catch (error) {
      console.warn('Failed to set allowed domains:', error);
    }
  }

  // Check if user is connected
  async isConnected() {
    try {
      if (!this.isAvailable) {
        return false;
      }

      const publicKey = await this.getPublicKey();
      return !!publicKey;
    } catch (error) {
      return false;
    }
  }

  // Get account info
  async getAccountInfo() {
    try {
      if (!this.isAvailable) {
        throw new Error('Freighter not available');
      }

      const publicKey = await this.getPublicKey();
      const network = await this.getNetwork();
      
      return {
        publicKey,
        network,
        isConnected: true
      };
    } catch (error) {
      throw new Error(`Failed to get account info: ${error.message}`);
    }
  }

  // Request access to Freighter
  async requestAccess() {
    try {
      if (!this.isAvailable) {
        throw new Error('Freighter not available. Please install Freighter extension.');
      }

      // Set allowed domains for security
      await this.setAllowedDomains(['localhost', '127.0.0.1']);

      const publicKey = await this.getPublicKey();
      const network = await this.getNetwork();

      return {
        publicKey,
        network,
        isConnected: true
      };
    } catch (error) {
      throw new Error(`Failed to connect to Freighter: ${error.message}`);
    }
  }

  // Disconnect from Freighter
  async disconnect() {
    // Freighter doesn't have a disconnect method
    // We just clear our local state
    return true;
  }

  // Get Freighter version
  async getVersion() {
    try {
      if (!this.isAvailable) {
        throw new Error('Freighter not available');
      }

      return await window.freighterApi.getVersion();
    } catch (error) {
      throw new Error(`Failed to get Freighter version: ${error.message}`);
    }
  }

  // Check if Freighter is unlocked
  async isUnlocked() {
    try {
      if (!this.isAvailable) {
        return false;
      }

      const publicKey = await this.getPublicKey();
      return !!publicKey;
    } catch (error) {
      return false;
    }
  }
}

export default new FreighterService();
