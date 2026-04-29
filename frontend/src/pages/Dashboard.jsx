import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import accountService from '../services/accountService';
import transactionService from '../services/transactionService';
import Modal from '../components/Modal';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [newAccountType, setNewAccountType] = useState('savings');

  const [showAllAccounts, setShowAllAccounts] = useState(false);
  const [stats, setStats] = useState({
    totalBalance: 0,
    monthlyInflow: 0,
    monthlyOutflow: 0,
    balanceTrend: 0,
    lastTransaction: null
  });
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [isAccountView, setIsAccountView] = useState(false);
  const [accountStats, setAccountStats] = useState({
    balance: 0,
    monthlyInflow: 0,
    monthlyOutflow: 0,
    lastTransaction: null
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const customerId = user.id || user.customer_id;
      const accRes = await accountService.getAccountsByCustomerId(customerId);
      const accs = Array.isArray(accRes.data) ? accRes.data : [];
      setAccounts(accs);

      if (accs.length > 0) {
        const txRes = await transactionService.getHistory(accs[0].account_id);
        setRecentTransactions(Array.isArray(txRes.data) ? txRes.data.slice(0, 10) : []);
      }

      const statsRes = await accountService.getStats(customerId);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      showNotification("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountSpecificData = async (accountId) => {
    try {
      const txRes = await transactionService.getHistory(accountId);
      setRecentTransactions(Array.isArray(txRes.data) ? txRes.data.slice(0, 10) : []);

      const statsRes = await accountService.getAccountStats(accountId);
      setAccountStats(statsRes.data);
    } catch (err) {
      console.error("Error fetching account stats:", err);
    }
  };

  const handleAccountClick = (accountId) => {
    if (selectedAccountId === accountId) {
      // Toggle back to total view
      setSelectedAccountId(null);
      setIsAccountView(false);
      // Refresh total transactions
      if (accounts.length > 0) {
        transactionService.getHistory(accounts[0].account_id).then(res => {
           setRecentTransactions(Array.isArray(res.data) ? res.data.slice(0, 10) : []);
        });
      }
    } else {
      setSelectedAccountId(accountId);
      setIsAccountView(true);
      fetchAccountSpecificData(accountId);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const customerId = user.id || user.customer_id;
      await accountService.createAccount({
        customer_id: customerId,
        account_type: newAccountType,
        balance: 0
      });
      setIsCreatingAccount(false);
      fetchData();
      showNotification('Account opened successfully!', 'success');
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, 'error');
    }
  };

  const totalBalance = accounts.reduce(
    (acc, curr) => acc + Number(curr.balance || 0),
    0
  );

  // Mock chart data based on recent transactions or just random for aesthetic
  const chartData = useMemo(() => {
    if (recentTransactions.length > 0) {
      let balance = totalBalance;
      return [...recentTransactions].reverse().map(tx => {
        balance = tx.transaction_type === 'deposit' ? balance - Number(tx.amount) : balance + Number(tx.amount);
        return {
          name: new Date(tx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          value: balance
        };
      }).concat([{ name: 'Today', value: totalBalance }]);
    }
    return [
      { name: 'Start', value: 0 },
      { name: 'Today', value: totalBalance },
    ];
  }, [recentTransactions, totalBalance]);


  const displayedAccounts = showAllAccounts ? accounts : accounts.slice(0, 3);

  if (loading) {
    return <div className="loading-screen"><div className="loader"></div></div>;
  }

  return (
    <div className="dashboard-page fade-in">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>Welcome back, {user?.name}</p>
        </div>
      </header>

      <div className="dashboard-top-nav">
        <span className="nav-tab active">Overview</span>
        <span className="nav-tab" onClick={() => navigate('/analytics')}>Analytics</span>
        <span className="nav-tab" onClick={() => navigate('/history')}>History</span>
      </div>

      <div className="dashboard-grid">
        <div className="main-column">
          {/* TOTAL BALANCE CARD WITH CHART */}
          <div className="balance-card-wrapper">
            <div className="balance-card-info">
              <span className="balance-label">{isAccountView ? 'Account Balance' : 'Total Balance'}</span>
              <div className="balance-amount">
                ₹{(isAccountView ? Number(accountStats.balance || 0) : totalBalance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                {!isAccountView && (
                  <span className={`balance-trend ${stats.balanceTrend >= 0 ? 'positive' : 'negative'}`}>
                    {stats.balanceTrend >= 0 ? '↗' : '↘'} {Math.abs(stats.balanceTrend).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            <div className="balance-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Balance']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="var(--primary)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <section className="accounts-section">
            <div className="section-header">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                <h3>Your Accounts</h3>
                {accounts.length > 3 && (
                  <button className="view-more-btn" onClick={() => setShowAllAccounts(!showAllAccounts)}>
                    {showAllAccounts ? (
                      <>View Less <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6"/></svg></>
                    ) : (
                      <>View More <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg></>
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className={`accounts-row ${showAllAccounts ? 'expanded' : ''}`}>
              {accounts.length > 0 ? displayedAccounts.map((acc, index) => (
                <div 
                  key={acc.account_id} 
                  className={`account-mini-card ${selectedAccountId === acc.account_id ? 'active' : ''}`} 
                  onClick={() => handleAccountClick(acc.account_id)}
                >
                  <div className="card-top">
                    <p className="account-type-label">{acc.account_type}</p>
                    <div className="card-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 10h18M5 10V21M19 10V21M9 10V21M15 10V21M12 3l7 7H5l7-7z"/></svg>
                    </div>
                  </div>
                  <h4>₹{Number(acc.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</h4>
                  <div className="card-footer">
                    <p className="text-sm">**** {String(acc.account_id).slice(-4)}</p>
                    <span className={`badge ${acc.status === 'active' ? 'badge-primary' : 'badge-error'}`} style={{ fontSize: '10px' }}>
                      {acc.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="card-panel" style={{ width: '100%', textAlign: 'center', padding: '3rem' }}>
                  <p>No accounts found. Create one to get started.</p>
                </div>
              )}
            </div>
          </section>

          <section className="transactions-section">
            <div className="section-header">
              <h3>{isAccountView ? 'Account Transactions' : 'Recent Transactions'}</h3>
              <button className="view-all-btn" onClick={() => navigate('/history')}>View All</button>
            </div>
            <div className="card-panel transactions-container">
              {recentTransactions.length > 0 ? (
                <div className="transactions-list">
                  {recentTransactions.map(tx => (
                    <div key={tx.transaction_id} className="transaction-item">
                      <div className={`transaction-icon-box ${tx.transaction_type}`}>
                        {tx.transaction_type === 'deposit' ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                        ) : tx.transaction_type === 'withdraw' ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l10-10M7 7h10v10"/></svg>
                        )}
                      </div>
                      <div className="transaction-details">
                        <p className="transaction-name">{tx.transaction_type.toUpperCase()}</p>
                        <p className="transaction-meta">{new Date(tx.created_at).toLocaleDateString()} • {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <div className={`transaction-value ${tx.transaction_type === 'deposit' ? 'positive' : 'negative'}`}>
                        {tx.transaction_type === 'deposit' ? '+' : '-'}₹{parseFloat(tx.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>
                  No recent transactions.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="side-column">
          <div className="card-panel quick-actions-card">
            <h3>Quick Actions</h3>
            <div className="quick-actions-list">
              <button className="quick-action-item" onClick={() => navigate('/transactions?tab=transfer')}>
                <div className="item-icon transfer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"/></svg>
                </div>
                <span>Transfer Funds</span>
              </button>
              <button className="quick-action-item" onClick={() => navigate('/transactions?tab=deposit')}>
                <div className="item-icon deposit">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                </div>
                <span>Deposit Money</span>
              </button>
              <button className="quick-action-item" onClick={() => setIsCreatingAccount(true)}>
                <div className="item-icon account">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg>
                </div>
                <span>Open New Account</span>
              </button>
            </div>
            <div className="last-transfer-info">
              <p className="text-sm">Last activity: <span>{(isAccountView ? accountStats.lastTransaction : stats.lastTransaction) ? new Date(isAccountView ? accountStats.lastTransaction : stats.lastTransaction).toLocaleString() : 'No activity'}</span></p>
            </div>
          </div>

          <div className="card-panel budget-widget">
            <h3>{isAccountView ? 'Account Cash Flow' : 'Monthly Cash Flow'}</h3>
            <div className="flow-item">
              <div className="flow-label">
                <span>Inflow</span>
                <span className="positive">+₹{parseFloat(isAccountView ? accountStats.monthlyInflow : stats.monthlyInflow || 0).toLocaleString()}</span>
              </div>
              <div className="flow-bar"><div className="flow-fill inflow" style={{ width: (isAccountView ? accountStats.monthlyInflow : stats.monthlyInflow) > 0 ? '100%' : '0%' }}></div></div>
            </div>
            <div className="flow-item">
              <div className="flow-label">
                <span>Outflow</span>
                <span className="negative">-₹{parseFloat(isAccountView ? accountStats.monthlyOutflow : stats.monthlyOutflow || 0).toLocaleString()}</span>
              </div>
              <div className="flow-bar"><div className="flow-fill outflow" style={{ width: (isAccountView ? accountStats.monthlyOutflow : stats.monthlyOutflow) > 0 ? '100%' : '0%' }}></div></div>
            </div>
          </div>

        </div>
      </div>

      <Modal 
        isOpen={isCreatingAccount} 
        onClose={() => setIsCreatingAccount(false)}
        title="Open New Account"
      >
        <form onSubmit={handleCreateAccount} className="modal-form">
          <p className="text-sm mb-4">Choose the type of account you want to open with Prosper Bank.</p>
          <div className="form-group">
            <label className="text-label">Account Type</label>
            <select 
              className="input-field" 
              value={newAccountType}
              onChange={(e) => setNewAccountType(e.target.value)}
            >
              <option value="savings">Savings Account (3.5% APY)</option>
              <option value="checking">Corporate Checking</option>
              <option value="business">Business Account</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="secondary-btn" onClick={() => setIsCreatingAccount(false)}>Cancel</button>
            <button type="submit" className="primary-btn">Open Account</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
