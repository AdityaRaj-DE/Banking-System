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
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [newAccountType, setNewAccountType] = useState('savings');

  const [showAllAccounts, setShowAllAccounts] = useState(false);

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
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      showNotification("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
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
      { name: 'Mon', value: totalBalance * 0.9 },
      { name: 'Tue', value: totalBalance * 0.95 },
      { name: 'Wed', value: totalBalance * 0.92 },
      { name: 'Thu', value: totalBalance * 0.98 },
      { name: 'Fri', value: totalBalance * 1.05 },
      { name: 'Sat', value: totalBalance * 1.02 },
      { name: 'Today', value: totalBalance },
    ];
  }, [recentTransactions, totalBalance]);

  const filteredTransactions = recentTransactions.filter(tx => 
    tx.transaction_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tx.from_account && String(tx.from_account).includes(searchTerm)) ||
    (tx.to_account && String(tx.to_account).includes(searchTerm))
  );

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
        <div className="search-bar">
          <div className="input-with-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search transactions..." 
              style={{ width: '300px', paddingLeft: '2.5rem', paddingRight: '2.5rem' }} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="clear-search-btn" 
                onClick={() => setSearchTerm('')}
                style={{ position: 'absolute', right: '0.75rem', color: 'var(--on-surface-variant)', opacity: 0.7 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            )}
          </div>
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
              <span className="balance-label">Total Balance</span>
              <div className="balance-amount">
                ₹{totalBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                <span className="balance-trend">↗ +4.2%</span>
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
              <button className="primary-btn btn-sm" onClick={() => setIsCreatingAccount(true)} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                + Open New Account
              </button>
            </div>
            <div className={`accounts-row ${showAllAccounts ? 'expanded' : ''}`}>
              {accounts.length > 0 ? displayedAccounts.map((acc, index) => (
                <div key={acc.account_id} className={`account-mini-card ${index === 0 ? 'active' : ''}`} onClick={() => navigate('/history')}>
                  <div className="card-top">
                    <p className="account-type-label">{acc.account_type}</p>
                    <div className="card-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 10h18M5 10V21M19 10V21M9 10V21M15 10V21M12 3l7 7H5l7-7z"/></svg>
                    </div>
                  </div>
                  <h4>₹{Number(acc.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</h4>
                  <div className="card-footer">
                    <p className="text-sm">**** {String(acc.account_id).slice(-4)}</p>
                    <span className="badge badge-primary" style={{ fontSize: '10px' }}>Active</span>
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
              <h3>Recent Transactions</h3>
              <button className="view-all-btn" onClick={() => navigate('/history')}>View All</button>
            </div>
            <div className="card-panel transactions-container">
              {filteredTransactions.length > 0 ? (
                <div className="transactions-list">
                  {filteredTransactions.map(tx => (
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
                  {searchTerm ? 'No matching transactions found.' : 'No recent transactions.'}
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
            </div>
            <div className="last-transfer-info">
              <p className="text-sm">Last transfer: <span>Today, 09:42 AM</span></p>
            </div>
          </div>

          <div className="card-panel budget-widget">
            <h3>Monthly Cash Flow</h3>
            <div className="flow-item">
              <div className="flow-label">
                <span>Inflow</span>
                <span className="positive">+₹12,400</span>
              </div>
              <div className="flow-bar"><div className="flow-fill inflow" style={{ width: '70%' }}></div></div>
            </div>
            <div className="flow-item">
              <div className="flow-label">
                <span>Outflow</span>
                <span className="negative">-₹8,200</span>
              </div>
              <div className="flow-bar"><div className="flow-fill outflow" style={{ width: '45%' }}></div></div>
            </div>
            <p className="text-sm mt-4">Your spending is down 12% compared to last month. Keep it up!</p>
          </div>

          <div className="premium-upsell">
            <div className="upsell-icon">💎</div>
            <h4>Unlock Premium</h4>
            <p className="text-sm">Get 5% cashback on all transactions and priority support.</p>
            <button className="secondary-btn btn-sm" style={{ marginTop: '1rem', width: '100%', borderColor: 'white', color: 'white' }}>Upgrade Now</button>
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
