import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import freighterService from '../services/freighterService';

const StellarContext = createContext();

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_NETWORK: 'SET_NETWORK',
  SET_WALLET: 'SET_WALLET',
  SET_ACCOUNT: 'SET_ACCOUNT',
  CLEAR_WALLET: 'CLEAR_WALLET',
  SET_ERROR: 'SET_ERROR'
};

// Initial state
const initialState = {
  loading: false,
  network: 'testnet',
  wallet: null,
  account: null,
  error: null,
  freighterAvailable: false,
  walletType: null // 'freighter' or 'manual'
};

// Reducer
function stellarReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_NETWORK:
      return { ...state, network: action.payload, error: null };
    case ACTIONS.SET_WALLET:
      return { ...state, wallet: action.payload, error: null };
    case ACTIONS.SET_ACCOUNT:
      return { ...state, account: action.payload, error: null };
    case ACTIONS.CLEAR_WALLET:
      return { ...state, wallet: null, account: null, error: null, walletType: null };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case 'SET_FREIGHTER_AVAILABLE':
      return { ...state, freighterAvailable: action.payload };
    case 'SET_WALLET_TYPE':
      return { ...state, walletType: action.payload };
    default:
      return state;
  }
}

// Provider component
export function StellarProvider({ children }) {
  const [state, dispatch] = useReducer(stellarReducer, initialState);

  // API base URL
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  // Switch network
  const switchNetwork = async (network) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      const response = await axios.post(`${API_BASE}/stellar/network`, { network });
      
      if (response.data.success) {
        dispatch({ type: ACTIONS.SET_NETWORK, payload: network });
        toast.success(`Switched to ${network}`);
        
        // Clear wallet when switching networks
        dispatch({ type: ACTIONS.CLEAR_WALLET });
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(`Failed to switch network: ${errorMessage}`);
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Generate new wallet
  const generateWallet = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      const response = await axios.post(`${API_BASE}/stellar/keypair`);
      
      if (response.data.success) {
        const wallet = {
          publicKey: response.data.publicKey,
          secretKey: response.data.secretKey
        };
        
        dispatch({ type: ACTIONS.SET_WALLET, payload: wallet });
        toast.success('New wallet generated!');
        
        // Auto-fund if testnet
        if (state.network === 'testnet') {
          await fundTestAccount(wallet.publicKey);
        }
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(`Failed to generate wallet: ${errorMessage}`);
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Fund test account
  const fundTestAccount = async (publicKey) => {
    try {
      const response = await axios.post(`${API_BASE}/stellar/fund`, { publicKey });
      
      if (response.data.success) {
        toast.success('Test account funded!');
        // Refresh account info
        await loadAccount(publicKey);
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(`Failed to fund account: ${errorMessage}`);
    }
  };

  // Load account info
  const loadAccount = async (publicKey) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      const response = await axios.get(`${API_BASE}/stellar/account/${publicKey}`);
      
      if (response.data.success) {
        dispatch({ type: ACTIONS.SET_ACCOUNT, payload: response.data.account });
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(`Failed to load account: ${errorMessage}`);
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Connect wallet with secret key
  const connectWallet = async (secretKey) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      // Validate secret key by creating keypair
      const StellarSdk = require('stellar-sdk');
      const keypair = StellarSdk.Keypair.fromSecret(secretKey);
      
      const wallet = {
        publicKey: keypair.publicKey(),
        secretKey: secretKey
      };
      
      dispatch({ type: ACTIONS.SET_WALLET, payload: wallet });
      
      // Load account info
      await loadAccount(wallet.publicKey);
      
      toast.success('Wallet connected!');
    } catch (error) {
      const errorMessage = 'Invalid secret key';
      dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    dispatch({ type: ACTIONS.CLEAR_WALLET });
    toast.success('Wallet disconnected');
  };

  // Send payment
  const sendPayment = async (destinationPublicKey, amount, asset = 'XLM', memo = '') => {
    try {
      if (!state.wallet) {
        throw new Error('No wallet connected');
      }
      
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      // Create payment transaction
      const paymentResponse = await axios.post(`${API_BASE}/stellar/payment`, {
        sourceSecret: state.wallet.secretKey,
        destinationPublicKey,
        amount,
        asset,
        memo
      });
      
      if (!paymentResponse.data.success) {
        throw new Error(paymentResponse.data.error);
      }
      
      // Submit transaction
      const submitResponse = await axios.post(`${API_BASE}/stellar/submit`, {
        transactionXdr: paymentResponse.data.transaction
      });
      
      if (submitResponse.data.success) {
        toast.success('Payment sent successfully!');
        
        // Refresh account info
        await loadAccount(state.wallet.publicKey);
        
        return submitResponse.data.result;
      } else {
        throw new Error(submitResponse.data.error);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(`Payment failed: ${errorMessage}`);
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Get network info
  const getNetworkInfo = async () => {
    try {
      const response = await axios.get(`${API_BASE}/stellar/network`);
      if (response.data.success) {
        dispatch({ type: ACTIONS.SET_NETWORK, payload: response.data.network });
      }
    } catch (error) {
      console.error('Failed to get network info:', error);
    }
  };

  // Connect with Freighter
  const connectFreighter = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      const accountInfo = await freighterService.requestAccess();
      
      const wallet = {
        publicKey: accountInfo.publicKey,
        secretKey: null, // Freighter doesn't expose secret keys
        type: 'freighter'
      };
      
      dispatch({ type: ACTIONS.SET_WALLET, payload: wallet });
      dispatch({ type: 'SET_WALLET_TYPE', payload: 'freighter' });
      
      // Load account info
      await loadAccount(wallet.publicKey);
      
      toast.success('Connected to Freighter wallet!');
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(`Failed to connect Freighter: ${errorMessage}`);
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Check Freighter availability
  const checkFreighterAvailability = async () => {
    const isAvailable = await freighterService.checkAvailability();
    dispatch({ type: 'SET_FREIGHTER_AVAILABLE', payload: isAvailable });
    return isAvailable;
  };

  // Send payment with Freighter
  const sendPaymentWithFreighter = async (destinationPublicKey, amount, asset = 'XLM', memo = '') => {
    try {
      if (!state.wallet || state.walletType !== 'freighter') {
        throw new Error('Freighter wallet not connected');
      }
      
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      // Create payment transaction
      const paymentResponse = await axios.post(`${API_BASE}/stellar/payment`, {
        sourceSecret: null, // We'll handle this differently for Freighter
        destinationPublicKey,
        amount,
        asset,
        memo
      });
      
      if (!paymentResponse.data.success) {
        throw new Error(paymentResponse.data.error);
      }
      
      // Sign with Freighter
      const signedXdr = await freighterService.signTransaction(
        paymentResponse.data.transaction,
        state.network
      );
      
      // Submit transaction
      const submitResponse = await axios.post(`${API_BASE}/stellar/submit`, {
        transactionXdr: signedXdr
      });
      
      if (submitResponse.data.success) {
        toast.success('Payment sent successfully!');
        
        // Refresh account info
        await loadAccount(state.wallet.publicKey);
        
        return submitResponse.data.result;
      } else {
        throw new Error(submitResponse.data.error);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(`Payment failed: ${errorMessage}`);
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Load network info and check Freighter on mount
  useEffect(() => {
    getNetworkInfo();
    checkFreighterAvailability();
  }, []);

  const value = {
    ...state,
    switchNetwork,
    generateWallet,
    fundTestAccount,
    loadAccount,
    connectWallet,
    disconnectWallet,
    sendPayment,
    connectFreighter,
    checkFreighterAvailability,
    sendPaymentWithFreighter
  };

  return (
    <StellarContext.Provider value={value}>
      {children}
    </StellarContext.Provider>
  );
}

// Hook to use Stellar context
export function useStellar() {
  const context = useContext(StellarContext);
  if (!context) {
    throw new Error('useStellar must be used within a StellarProvider');
  }
  return context;
}
