# 🔗 Freighter Wallet Integration

RentGuard now supports **Freighter Wallet**, the official Stellar wallet extension for browsers. This provides a secure and user-friendly way to interact with Stellar applications.

## ✨ Features

### 🔐 **Secure Authentication**
- **No private key exposure**: Your secret keys never leave Freighter
- **Hardware security**: Keys are stored securely in the browser extension
- **One-click login**: Connect with just one click

### ⚡ **Easy Transactions**
- **Automatic signing**: Transactions are signed automatically by Freighter
- **Network detection**: Automatically detects testnet/mainnet
- **Transaction preview**: See transaction details before signing

### 🌐 **Multi-Network Support**
- **Testnet**: Perfect for development and testing
- **Mainnet**: Ready for production use
- **Automatic switching**: Seamlessly switch between networks

## 🚀 Getting Started

### 1. Install Freighter Wallet

1. Visit [freighter.app](https://freighter.app/)
2. Click "Install Extension"
3. Add to your browser (Chrome, Firefox, Edge, Safari)
4. Create a new wallet or import existing one

### 2. Connect to RentGuard

1. Open RentGuard application
2. Go to the **Wallet** page
3. Click **"Connect with Freighter"**
4. Approve the connection in Freighter popup
5. You're connected! 🎉

### 3. Testnet Setup

For testing purposes:

1. **Switch to Testnet** in Freighter
2. **Create a test account** or import existing
3. **Get test XLM** from [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=testnet)
4. **Start testing** your rental transactions!

## 🔧 Technical Details

### API Integration

```javascript
// Check if Freighter is available
const isAvailable = await freighterService.checkAvailability();

// Get user's public key
const publicKey = await freighterService.getPublicKey();

// Sign a transaction
const signedXdr = await freighterService.signTransaction(xdr, network);
```

### Security Features

- **Domain whitelisting**: Only approved domains can request signatures
- **Transaction validation**: All transactions are validated before signing
- **Network verification**: Ensures transactions are sent to correct network

## 📱 User Experience

### Connection Flow

1. **Detection**: App automatically detects if Freighter is installed
2. **Prompt**: User sees "Connect with Freighter" button if available
3. **Authorization**: Freighter popup asks for permission
4. **Confirmation**: User confirms connection
5. **Ready**: Wallet is connected and ready to use

### Transaction Flow

1. **Create**: User initiates a transaction (rent payment, etc.)
2. **Preview**: Transaction details are shown
3. **Sign**: Freighter popup appears for signing
4. **Submit**: Signed transaction is submitted to network
5. **Confirm**: User sees transaction confirmation

## 🛠️ Development

### Testing with Freighter

1. **Install Freighter** in your browser
2. **Switch to testnet** in Freighter settings
3. **Create test account** or import existing
4. **Fund account** with test XLM
5. **Test transactions** in RentGuard

### Debugging

```javascript
// Check Freighter availability
console.log('Freighter available:', await freighterService.checkAvailability());

// Get account info
const accountInfo = await freighterService.getAccountInfo();
console.log('Account:', accountInfo);

// Check if unlocked
const isUnlocked = await freighterService.isUnlocked();
console.log('Unlocked:', isUnlocked);
```

## 🔒 Security Best Practices

### For Users

- **Never share** your Freighter seed phrase
- **Verify transactions** before signing
- **Use testnet** for testing
- **Keep Freighter updated**

### For Developers

- **Validate all inputs** before creating transactions
- **Show clear transaction details** to users
- **Handle errors gracefully**
- **Test with both testnet and mainnet**

## 🌟 Benefits

### For Users
- ✅ **Easy setup**: No need to manage private keys
- ✅ **Secure**: Keys never leave the extension
- ✅ **Convenient**: One-click transactions
- ✅ **Reliable**: Official Stellar wallet

### For Developers
- ✅ **Standard integration**: Uses official Stellar APIs
- ✅ **Better UX**: Seamless user experience
- ✅ **Security**: No key management required
- ✅ **Compatibility**: Works with all Stellar features

## 📚 Resources

- **Freighter Website**: [freighter.app](https://freighter.app/)
- **Stellar Documentation**: [developers.stellar.org](https://developers.stellar.org/)
- **Testnet Faucet**: [laboratory.stellar.org](https://laboratory.stellar.org/#account-creator?network=testnet)
- **Stellar Laboratory**: [laboratory.stellar.org](https://laboratory.stellar.org/)

## 🎯 Next Steps

1. **Install Freighter** in your browser
2. **Create a test account** on testnet
3. **Fund your account** with test XLM
4. **Connect to RentGuard** and start testing!

---

**Ready to get started?** Visit [freighter.app](https://freighter.app/) to install the extension and begin your Stellar journey! 🚀
