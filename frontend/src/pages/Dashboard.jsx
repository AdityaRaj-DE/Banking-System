import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import accountService from '../services/accountService';
import transactionService from '../services/transactionService';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [newAccountType, setNewAccountType] = useState('savings');

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

      // Fetch history for the first account to show real data in "Recent Transactions"
      if (accs.length > 0) {
        const txRes = await transactionService.getHistory(accs[0].account_id);
        setRecentTransactions(Array.isArray(txRes.data) ? txRes.data.slice(0, 5) : []);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
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
      alert('Account created successfully!');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const totalBalance = accounts.reduce(
    (acc, curr) => acc + Number(curr.balance || 0),
    0
  );

  const filteredTransactions = recentTransactions.filter(tx => 
    tx.transaction_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tx.from_account && String(tx.from_account).includes(searchTerm)) ||
    (tx.to_account && String(tx.to_account).includes(searchTerm))
  );

  if (loading) {
    return <div className="loading-screen"></div>;
  }

  return (
    <div className="dashboard-page fade-in">
      {/* HEADER */}
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="search-bar">
          <input 
            type="text" 
            className="input-field" 
            placeholder="Search recent transactions..." 
            style={{ width: '300px' }} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* TOP NAV TABS (Cleaned up) */}
      <div className="dashboard-top-nav">
        <span className="nav-tab active">Overview</span>
      </div>

      <div className="dashboard-grid">
        {/* MAIN COLUMN */}
        <div className="main-column">
          {/* TOTAL BALANCE CARD */}
          <div className="balance-card">
            <span className="balance-label">Total Balance</span>
            <div className="balance-amount">
              ₹{totalBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              <span className="balance-trend">↗ Active</span>
            </div>
          </div>

          {/* ACCOUNTS SECTION */}
          <section className="accounts-section">
            <div className="section-header">
              <h3>Your Accounts</h3>
              <button className="primary-btn btn-sm" onClick={() => setIsCreatingAccount(true)} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                + Create Account
              </button>
            </div>
            <div className="accounts-row">
              {accounts.length > 0 ? accounts.map((acc, index) => (
                <div key={acc.account_id} className={`account-mini-card ${index === 0 ? 'active' : ''}`} onClick={() => navigate('/history')}>
                  <p className="account-type-label">{acc.account_type.toUpperCase()}</p>
                  <h4>₹{Number(acc.balance).toLocaleString("en-IN")}</h4>
                  <p className="text-sm">**** {String(acc.account_id).slice(-4)}</p>
                </div>
              )) : (
                <div className="account-mini-card" style={{ width: '100%', textAlign: 'center' }}>
                  <p>No accounts found. Create one to get started.</p>
                </div>
              )}
            </div>
          </section>

          {/* RECENT TRANSACTIONS */}
          <section className="transactions-section">
            <div className="section-header">
              <h3>Recent Transactions</h3>
              <button className="view-all" onClick={() => navigate('/history')}>View All</button>
            </div>
            <div className="card-panel transactions-list">
              {filteredTransactions.length > 0 ? filteredTransactions.map(tx => (
                <div key={tx.transaction_id} className="transaction-item">
                  <div className="transaction-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {tx.transaction_type === 'deposit' ? <path d="M7 17l10-10M7 7h10v10" /> : <path d="M17 7l-10 10M17 17H7V7" />}
                    </svg>
                  </div>
                  <div className="transaction-info">
                    <p className="transaction-title" style={{ textTransform: 'capitalize' }}>{tx.transaction_type}</p>
                    <p className="transaction-date">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className={`transaction-amount ${tx.transaction_type === 'deposit' ? 'amount-positive' : 'amount-negative'}`}>
                    {tx.transaction_type === 'deposit' ? '+' : '-'}₹{parseFloat(tx.amount).toLocaleString()}
                  </div>
                </div>
              )) : (
                <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--on-surface-variant)' }}>
                  {searchTerm ? 'No matching transactions found.' : 'No recent transactions.'}
                </p>
              )}
            </div>
          </section>
        </div>

        {/* SIDE COLUMN */}
        <div className="side-column">
          {/* QUICK ACTIONS */}
          <div className="card-panel quick-actions-card">
            <h3>Quick Actions</h3>
            <div className="quick-actions-grid">
              <button className="action-btn" onClick={() => navigate('/transactions?tab=transfer')}>
                <div className="action-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
                Transfer
              </button>
              <button className="action-btn" onClick={() => navigate('/transactions?tab=deposit')}>
                <div className="action-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                </div>
                Deposit
              </button>
            </div>
          </div>

          <div className="card-panel" style={{ background: 'var(--primary-container)', border: 'none' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Secure Banking</h4>
            <p className="text-sm" style={{ color: 'var(--primary)', opacity: 0.8 }}>
              All your transactions are encrypted and monitored for suspicious activity.
            </p>
          </div>
        </div>
      </div>

      {/* CREATE ACCOUNT MODAL */}
      {isCreatingAccount && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyCenter: 'center', zIndex: 1000 }}>
          <div className="card-panel" style={{ width: '100%', maxWidth: '400px', margin: 'auto' }}>
            <h3>Open New Account</h3>
            <form onSubmit={handleCreateAccount} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label>Account Type</label>
                <select 
                  className="input-field" 
                  value={newAccountType}
                  onChange={(e) => setNewAccountType(e.target.value)}
                >
                  <option value="savings">Savings Account</option>
                  <option value="checking">Checking Account</option>
                  <option value="business">Business Account</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="secondary-btn" onClick={() => setIsCreatingAccount(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="primary-btn" style={{ flex: 1 }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
