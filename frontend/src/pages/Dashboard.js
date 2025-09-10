import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Building, 
  Users, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { useStellar } from '../context/StellarContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #cccccc;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 212, 255, 0.4);
    box-shadow: 0 10px 30px rgba(0, 212, 255, 0.1);
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #00d4ff, #00a8cc);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #cccccc;
  margin-bottom: 0.5rem;
`;

const StatChange = styled.div`
  font-size: 0.9rem;
  color: ${props => props.positive ? '#4ecdc4' : '#ff6b6b'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PlaceholderChart = styled.div`
  height: 300px;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 168, 204, 0.1));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 1.1rem;
  border: 2px dashed rgba(0, 212, 255, 0.3);
`;

const RecentActivity = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${props => props.type === 'payment' 
    ? 'linear-gradient(135deg, #4ecdc4, #44a08d)'
    : 'linear-gradient(135deg, #00d4ff, #00a8cc)'
  };
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.25rem;
`;

const ActivityDescription = styled.div`
  font-size: 0.9rem;
  color: #888;
`;

const ActivityTime = styled.div`
  font-size: 0.8rem;
  color: #888;
`;

const ActivityAmount = styled.div`
  font-weight: 600;
  color: ${props => props.type === 'sent' ? '#ff6b6b' : '#4ecdc4'};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #888;
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: #00d4ff;
`;

function Dashboard() {
  const { wallet, account } = useStellar();
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeRentals: 0,
    monthlyRevenue: 0,
    totalTransactions: 0
  });

  const mockActivity = [
    {
      type: 'payment',
      title: 'Rent Payment Received',
      description: 'From John Doe - Property #123',
      time: '2 hours ago',
      amount: '+150 XLM',
      amountType: 'received'
    },
    {
      type: 'property',
      title: 'New Property Added',
      description: 'Downtown Apartment - 2BR/2BA',
      time: '1 day ago',
      amount: '',
      amountType: ''
    },
    {
      type: 'payment',
      title: 'Rent Payment Sent',
      description: 'To Landlord - Property #456',
      time: '3 days ago',
      amount: '-200 XLM',
      amountType: 'sent'
    }
  ];

  useEffect(() => {
    // Mock data - replace with real API calls
    setStats({
      totalProperties: 5,
      activeRentals: 3,
      monthlyRevenue: 1250,
      totalTransactions: 47
    });
  }, []);

  if (!wallet) {
    return (
      <Container>
        <EmptyState>
          <EmptyIcon>
            <Activity size={40} />
          </EmptyIcon>
          <h3>Connect Your Wallet</h3>
          <p>Please connect your wallet to view your dashboard and analytics.</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>Overview of your rental properties and transactions</Subtitle>
      </Header>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <StatIcon>
            <Building size={24} />
          </StatIcon>
          <StatValue>{stats.totalProperties}</StatValue>
          <StatLabel>Total Properties</StatLabel>
          <StatChange positive>
            <ArrowUpRight size={16} />
            +2 this month
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <StatIcon>
            <Users size={24} />
          </StatIcon>
          <StatValue>{stats.activeRentals}</StatValue>
          <StatLabel>Active Rentals</StatLabel>
          <StatChange positive>
            <ArrowUpRight size={16} />
            +1 this week
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <StatIcon>
            <DollarSign size={24} />
          </StatIcon>
          <StatValue>{stats.monthlyRevenue} XLM</StatValue>
          <StatLabel>Monthly Revenue</StatLabel>
          <StatChange positive>
            <ArrowUpRight size={16} />
            +12% from last month
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <StatIcon>
            <BarChart3 size={24} />
          </StatIcon>
          <StatValue>{stats.totalTransactions}</StatValue>
          <StatLabel>Total Transactions</StatLabel>
          <StatChange positive>
            <ArrowUpRight size={16} />
            +8 this week
          </StatChange>
        </StatCard>
      </StatsGrid>

      <ChartsSection>
        <ChartCard>
          <ChartTitle>
            <TrendingUp size={20} />
            Revenue Overview
          </ChartTitle>
          <PlaceholderChart>
            Revenue chart will be displayed here
          </PlaceholderChart>
        </ChartCard>

        <ChartCard>
          <ChartTitle>
            <Calendar size={20} />
            Recent Activity
          </ChartTitle>
          <div>
            {mockActivity.map((activity, index) => (
              <ActivityItem key={index}>
                <ActivityIcon type={activity.type}>
                  {activity.type === 'payment' ? <DollarSign size={20} /> : <Building size={20} />}
                </ActivityIcon>
                <ActivityContent>
                  <ActivityTitle>{activity.title}</ActivityTitle>
                  <ActivityDescription>{activity.description}</ActivityDescription>
                  <ActivityTime>{activity.time}</ActivityTime>
                </ActivityContent>
                {activity.amount && (
                  <ActivityAmount type={activity.amountType}>
                    {activity.amount}
                  </ActivityAmount>
                )}
              </ActivityItem>
            ))}
          </div>
        </ChartCard>
      </ChartsSection>

      <RecentActivity>
        <ChartTitle>
          <Activity size={20} />
          Transaction History
        </ChartTitle>
        {account?.recentTransactions && account.recentTransactions.length > 0 ? (
          <div>
            {account.recentTransactions.slice(0, 5).map((tx, index) => (
              <ActivityItem key={index}>
                <ActivityIcon type="payment">
                  <DollarSign size={20} />
                </ActivityIcon>
                <ActivityContent>
                  <ActivityTitle>Transaction</ActivityTitle>
                  <ActivityDescription>
                    Hash: {tx.hash ? `${tx.hash.slice(0, 8)}...${tx.hash.slice(-8)}` : 'Unknown'}
                  </ActivityDescription>
                  <ActivityTime>
                    {new Date(tx.created_at).toLocaleString()}
                  </ActivityTime>
                </ActivityContent>
                <ActivityAmount>
                  View Details
                </ActivityAmount>
              </ActivityItem>
            ))}
          </div>
        ) : (
          <EmptyState>
            <p>No recent transactions found</p>
          </EmptyState>
        )}
      </RecentActivity>
    </Container>
  );
}

export default Dashboard;
