import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import accountService from '../services/accountService';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user]);

  const fetchAccounts = async () => {
    try {
      const customerId = user.id || user.customer_id;
      const response = await accountService.getAccountsByCustomerId(customerId);
      setAccounts(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async () => {
    const type = prompt('Enter account type (savings/current):', 'savings');
    if (!type) return;
    
    try {
      const customerId = user.id || user.customer_id;
      await accountService.createAccount({ customer_id: customerId, account_type: type });
      fetchAccounts();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading">Loading accounts...</div>;

  const totalBalance = accounts.reduce((acc, curr) => {
    const val = parseFloat(curr.balance);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <div className="dashboard-page fade-in">
      <header className="dashboard-header">
        <div>
          <h1>Account Overview</h1>
          <p>Welcome back, {user?.name}</p>
        </div>
        <button onClick={createAccount} className="primary-btn">+ Open New Account</button>
      </header>

      <section className="summary-section">
        <div className="summary-card glass-panel">
          <span className="summary-label">Total Balance</span>
          <h2 className="summary-value">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
          <div className="summary-footer">
            <span className="badge badge-success">Active</span>
            <span className="summary-info">{accounts.length} Accounts</span>
          </div>
        </div>
      </section>

      <section className="accounts-section">
        <h3>My Accounts</h3>
        <div className="accounts-grid">
          {accounts.map(account => (
            <div key={account.account_id} className="account-card glass-panel">
              <div className="account-card-header">
                <span className="badge badge-primary">{account.account_type}</span>
                <span className="account-id">#{account.account_id}</span>
              </div>
              <div className="account-card-body">
                <span className="balance-label">Available Balance</span>
                <h3 className="account-balance">${(parseFloat(account.balance) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
              </div>
              <div className="account-card-footer">
                <span className={`status-dot ${account.status}`}></span>
                <span className="status-text">{account.status}</span>
              </div>
            </div>
          ))}
        </div>
        {accounts.length === 0 && (
          <div className="empty-state glass-panel">
            <p>No accounts found. Create your first account to get started!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
