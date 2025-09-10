import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Key, 
  Copy, 
  Eye, 
  EyeOff, 
  Send, 
  Download, 
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { useStellar } from '../context/StellarContext';
import toast from 'react-hot-toast';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #cccccc;
  max-width: 600px;
  margin: 0 auto;
`;

const WalletSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const WalletInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const InfoCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 212, 255, 0.1);
`;

const InfoLabel = styled.div`
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  font-size: 1.1rem;
  color: #ffffff;
  font-family: 'Courier New', monospace;
  word-break: break-all;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  color: #00d4ff;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 212, 255, 0.1);
  }
`;

const BalanceCard = styled.div`
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 168, 204, 0.1));
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`;

const BalanceAmount = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #00d4ff;
  margin-bottom: 0.5rem;
`;

const BalanceLabel = styled.div`
  font-size: 1rem;
  color: #cccccc;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2rem;
`;

const ActionButton = styled.button`
  background: ${props => props.variant === 'primary' 
    ? 'linear-gradient(135deg, #00d4ff, #00a8cc)' 
    : 'rgba(0, 212, 255, 0.1)'
  };
  color: ${props => props.variant === 'primary' ? 'white' : '#00d4ff'};
  border: ${props => props.variant === 'primary' ? 'none' : '1px solid #00d4ff'};
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    ${props => props.variant === 'primary' 
      ? 'box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);'
      : 'background: rgba(0, 212, 255, 0.2);'
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const FormSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  color: #cccccc;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #ffffff;
  font-size: 1rem;
  
  &::placeholder {
    color: #888;
  }
  
  &:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #ffffff;
  font-size: 1rem;
  font-family: 'Courier New', monospace;
  min-height: 100px;
  resize: vertical;
  
  &::placeholder {
    color: #888;
  }
  
  &:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }
`;

const PasswordInput = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 0.25rem;
  
  &:hover {
    color: #00d4ff;
  }
`;

const TransactionHistory = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const TransactionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TransactionHash = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #00d4ff;
`;

const TransactionTime = styled.div`
  font-size: 0.8rem;
  color: #888;
`;

const TransactionAmount = styled.div`
  font-weight: 600;
  color: ${props => props.type === 'sent' ? '#ff6b6b' : '#4ecdc4'};
`;

const LoadingSpinner = styled(motion.div)`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 212, 255, 0.3);
  border-top: 2px solid #00d4ff;
  border-radius: 50%;
`;

function Wallet() {
  const { 
    wallet, 
    account, 
    loading, 
    generateWallet, 
    connectWallet, 
    disconnectWallet, 
    loadAccount,
    sendPayment 
  } = useStellar();
  
  const [showSecret, setShowSecret] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (wallet) {
      loadAccount(wallet.publicKey);
    }
  }, [wallet, loadAccount]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleGenerateWallet = async () => {
    await generateWallet();
  };

  const handleConnectWallet = async () => {
    if (!secretKey.trim()) {
      toast.error('Please enter a secret key');
      return;
    }
    await connectWallet(secretKey);
    setSecretKey('');
  };

  const handleSendPayment = async () => {
    if (!recipientAddress.trim() || !amount.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSending(true);
      await sendPayment(recipientAddress, parseFloat(amount), 'XLM', memo);
      setRecipientAddress('');
      setAmount('');
      setMemo('');
      toast.success('Payment sent successfully!');
    } catch (error) {
      toast.error('Failed to send payment');
    } finally {
      setSending(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const getBalance = () => {
    if (!account?.balances) return '0.00';
    const xlmBalance = account.balances.find(b => b.asset === 'XLM');
    return xlmBalance ? parseFloat(xlmBalance.balance).toFixed(2) : '0.00';
  };

  return (
    <Container>
      <Header>
        <Title>Wallet</Title>
        <Subtitle>
          Manage your Stellar wallet, view balances, and send payments securely
        </Subtitle>
      </Header>

      {!wallet ? (
        <WalletSection>
          <SectionTitle>
            <Wallet size={24} />
            Connect or Create Wallet
          </SectionTitle>
          
          <FormGroup>
            <Label>Secret Key (Connect existing wallet)</Label>
            <PasswordInput>
              <Input
                type={showSecret ? 'text' : 'password'}
                placeholder="Enter your secret key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
              />
              <PasswordToggle onClick={() => setShowSecret(!showSecret)}>
                {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
              </PasswordToggle>
            </PasswordInput>
          </FormGroup>

          <ActionButtons>
            <ActionButton onClick={handleConnectWallet} disabled={!secretKey.trim()}>
              <Key size={18} />
              Connect Wallet
            </ActionButton>
            <ActionButton variant="primary" onClick={handleGenerateWallet} disabled={loading}>
              {loading ? (
                <LoadingSpinner
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  <Plus size={18} />
                  Generate New Wallet
                </>
              )}
            </ActionButton>
          </ActionButtons>
        </WalletSection>
      ) : (
        <>
          <WalletSection>
            <SectionTitle>
              <Wallet size={24} />
              Wallet Information
            </SectionTitle>
            
            <WalletInfo>
              <InfoCard>
                <InfoLabel>Public Key</InfoLabel>
                <InfoValue>
                  {formatAddress(wallet.publicKey)}
                  <CopyButton onClick={() => copyToClipboard(wallet.publicKey)}>
                    <Copy size={16} />
                  </CopyButton>
                </InfoValue>
              </InfoCard>
              
              <InfoCard>
                <InfoLabel>Secret Key</InfoLabel>
                <InfoValue>
                  {showSecret ? formatAddress(wallet.secretKey) : '••••••••••••••••'}
                  <CopyButton onClick={() => copyToClipboard(wallet.secretKey)}>
                    <Copy size={16} />
                  </CopyButton>
                  <CopyButton onClick={() => setShowSecret(!showSecret)}>
                    {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                  </CopyButton>
                </InfoValue>
              </InfoCard>
            </WalletInfo>

            <BalanceCard>
              <BalanceAmount>{getBalance()} XLM</BalanceAmount>
              <BalanceLabel>Available Balance</BalanceLabel>
            </BalanceCard>

            <ActionButtons>
              <ActionButton onClick={() => loadAccount(wallet.publicKey)} disabled={loading}>
                <RefreshCw size={18} />
                Refresh
              </ActionButton>
              <ActionButton onClick={disconnectWallet}>
                <Trash2 size={18} />
                Disconnect
              </ActionButton>
            </ActionButtons>
          </WalletSection>

          <FormSection>
            <SectionTitle>
              <Send size={24} />
              Send Payment
            </SectionTitle>
            
            <FormGroup>
              <Label>Recipient Address *</Label>
              <Input
                type="text"
                placeholder="Enter recipient's public key"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Amount (XLM) *</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.0000001"
                min="0"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Memo (Optional)</Label>
              <Input
                type="text"
                placeholder="Payment description"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                maxLength="28"
              />
            </FormGroup>
            
            <ActionButtons>
              <ActionButton 
                variant="primary" 
                onClick={handleSendPayment}
                disabled={sending || !recipientAddress.trim() || !amount.trim()}
              >
                {sending ? (
                  <LoadingSpinner
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <Send size={18} />
                    Send Payment
                  </>
                )}
              </ActionButton>
            </ActionButtons>
          </FormSection>

          {account?.recentTransactions && account.recentTransactions.length > 0 && (
            <TransactionHistory>
              <SectionTitle>
                <RefreshCw size={24} />
                Recent Transactions
              </SectionTitle>
              
              {account.recentTransactions.map((tx, index) => (
                <TransactionItem key={index}>
                  <TransactionInfo>
                    <TransactionHash>
                      {tx.hash ? `${tx.hash.slice(0, 8)}...${tx.hash.slice(-8)}` : 'Unknown'}
                    </TransactionHash>
                    <TransactionTime>
                      {new Date(tx.created_at).toLocaleString()}
                    </TransactionTime>
                  </TransactionInfo>
                  <TransactionAmount type="sent">
                    View Details
                  </TransactionAmount>
                </TransactionItem>
              ))}
            </TransactionHistory>
          )}
        </>
      )}
    </Container>
  );
}

export default Wallet;
