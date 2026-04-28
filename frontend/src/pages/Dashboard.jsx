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
    if (user) fetchAccounts();
  }, [user]);

  const fetchAccounts = async () => {
    try {
      const customerId = user.id || user.customer_id;
      const response = await accountService.getAccountsByCustomerId(customerId);
      setAccounts(Array.isArray(response.data) ? response.data : []);
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
      await accountService.createAccount({
        customer_id: customerId,
        account_type: type
      });
      fetchAccounts();
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ Greeting function (NEW)
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning ";
    if (hour < 18) return "Good Afternoon ";
    return "Good Evening ";
  };

  // ✅ FIXED balance calculation
  const totalBalance = accounts.reduce(
    (acc, curr) => acc + Number(curr.balance || 0),
    0
  );

  if (loading) {
    return (
      <div className="accounts-grid">
        {[1, 2, 3].map(i => (
          <div key={i} className="account-card glass-panel skeleton"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="dashboard-page fade-in">

      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <h1>Account Overview</h1>
          <p>{getGreeting()}, {user?.name}</p>
        </div>
        <button onClick={createAccount} className="primary-btn">
          + Open New Account
        </button>
      </header>

      {/* SUMMARY */}
      <section className="summary-section">
        <div className="summary-card glass-panel">
          <span className="summary-label">Total Balance</span>

          {/* ✅ INR + formatted */}
          <h2 className="summary-value">
            ₹{totalBalance.toLocaleString("en-IN", {
              minimumFractionDigits: 2
            })}
          </h2>

          <div className="summary-footer">
            <span className="badge badge-success">Active</span>
            <span className="summary-info">
              {accounts.length} Accounts
            </span>
          </div>
        </div>
      </section>

      {/* ACCOUNTS */}
      <section className="accounts-section">
        <h3>My Accounts</h3>

        <div className="accounts-grid">
          {accounts.map(account => (
            <div
              key={account.account_id}
              className="account-card debit-card"
  >

  {/* TOP */}
  <div className="card-top">
    <span className="bank-name">Nexus Bank</span>
    <span className="card-type">{account.account_type}</span>
  </div>

  {/* 💳 CHIP */}
  <div className="card-chip"></div>

  {/* CARD NUMBER */}
  <div className="card-number">
    **** **** **** {String(account.account_id).slice(-4)}
  </div>

  {/* BALANCE */}
  <div className="card-balance">
    ₹{Number(account.balance || 0).toLocaleString("en-IN")}
  </div>

  {/* FOOTER */}
  <div className="card-footer">
    <span className="card-holder">{user?.name}</span>

    {/* 💠 VISA LOGO */}
    <span className="card-brand">VISA</span>
  </div>

</div>
))}
        </div>

        {/* EMPTY STATE */}
        {accounts.length === 0 && (
          <div className="empty-state glass-panel">
            <p>No accounts found. Create your first account </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;