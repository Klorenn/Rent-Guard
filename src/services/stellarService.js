const StellarSdk = require('stellar-sdk');
const config = require('../../config');

class StellarService {
  constructor() {
    this.network = config.stellar.network;
    this.horizonUrl = config.stellar.horizonUrl;
    this.server = new StellarSdk.Horizon.Server(this.horizonUrl);
    
    // Set network passphrase
    this.networkPassphrase = this.network === 'mainnet' 
      ? StellarSdk.Networks.PUBLIC 
      : StellarSdk.Networks.TESTNET;
  }

  // Switch between testnet and mainnet
  switchNetwork(network) {
    this.network = network;
    this.horizonUrl = network === 'mainnet' 
      ? config.stellar.mainnetHorizonUrl 
      : config.stellar.testnetHorizonUrl;
    
    this.server = new StellarSdk.Horizon.Server(this.horizonUrl);
    
    this.networkPassphrase = network === 'mainnet' 
      ? StellarSdk.Networks.PUBLIC 
      : StellarSdk.Networks.TESTNET;
  }

  // Generate a new keypair
  generateKeypair() {
    return StellarSdk.Keypair.random();
  }

  // Create account
  async createAccount(publicKey) {
    try {
      const account = await this.server.loadAccount(publicKey);
      return { success: true, account };
    } catch (error) {
      if (error.status === 404) {
        return { success: false, error: 'Account not found. Please fund the account first.' };
      }
      throw error;
    }
  }

  // Fund test account (testnet only)
  async fundTestAccount(publicKey) {
    if (this.network !== 'testnet') {
      throw new Error('Can only fund test accounts on testnet');
    }

    try {
      const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
      const result = await response.json();
      return { success: true, result };
    } catch (error) {
      throw new Error(`Failed to fund test account: ${error.message}`);
    }
  }

  // Get account balance
  async getAccountBalance(publicKey) {
    try {
      const account = await this.server.loadAccount(publicKey);
      const balances = account.balances.map(balance => ({
        asset: balance.asset_type === 'native' ? 'XLM' : `${balance.asset_code}:${balance.asset_issuer}`,
        balance: balance.balance,
        assetType: balance.asset_type
      }));
      return { success: true, balances };
    } catch (error) {
      if (error.status === 404) {
        return { success: false, error: 'Account not found' };
      }
      throw error;
    }
  }

  // Create payment transaction
  async createPaymentTransaction(sourceKeypair, destinationPublicKey, amount, asset = 'XLM', memo = '') {
    try {
      const sourceAccount = await this.server.loadAccount(sourceKeypair.publicKey());
      
      let paymentAsset;
      if (asset === 'XLM') {
        paymentAsset = StellarSdk.Asset.native();
      } else {
        const [assetCode, assetIssuer] = asset.split(':');
        paymentAsset = new StellarSdk.Asset(assetCode, assetIssuer);
      }

      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.networkPassphrase
      })
      .addOperation(StellarSdk.Operation.payment({
        destination: destinationPublicKey,
        asset: paymentAsset,
        amount: amount.toString()
      }))
      .addMemo(StellarSdk.Memo.text(memo))
      .setTimeout(180)
      .build();

      transaction.sign(sourceKeypair);
      
      return {
        success: true,
        transaction: transaction.toEnvelope().toXDR('base64'),
        hash: transaction.hash().toString('hex')
      };
    } catch (error) {
      throw new Error(`Failed to create payment transaction: ${error.message}`);
    }
  }

  // Submit transaction
  async submitTransaction(transactionXdr) {
    try {
      const transaction = StellarSdk.TransactionBuilder.fromXDR(transactionXdr, this.networkPassphrase);
      
      const result = await this.server.submitTransaction(transaction);
      return { success: true, result };
    } catch (error) {
      throw new Error(`Failed to submit transaction: ${error.message}`);
    }
  }

  // Get transaction history
  async getTransactionHistory(publicKey, limit = 10) {
    try {
      const transactions = await this.server.transactions()
        .forAccount(publicKey)
        .order('desc')
        .limit(limit)
        .call();
      
      return { success: true, transactions: transactions.records };
    } catch (error) {
      throw new Error(`Failed to get transaction history: ${error.message}`);
    }
  }

  // Validate public key
  isValidPublicKey(publicKey) {
    try {
      StellarSdk.Keypair.fromPublicKey(publicKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get network info
  getNetworkInfo() {
    return {
      network: this.network,
      horizonUrl: this.horizonUrl,
      passphrase: this.networkPassphrase
    };
  }
}

module.exports = new StellarService();
