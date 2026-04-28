import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import accountService from '../services/accountService';
import transactionService from '../services/transactionService';
import './Transactions.css';

const TransactionsPage = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [activeTab, setActiveTab] = useState('transfer');
  const [loading, setLoading] = useState(false);

  // Form states
  const [transferData, setTransferData] = useState({ from: '', to: '', amount: '' });
  const [actionData, setActionData] = useState({ account_id: '', amount: '' });

  useEffect(() => {
    if (user) fetchAccounts();
  }, [user]);

  const fetchAccounts = async () => {
    try {
      const customerId = user.id || user.customer_id;
      const res = await accountService.getAccountsByCustomerId(customerId);
      setAccounts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setAccounts([]);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const amount = parseFloat(transferData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount greater than zero');
      return;
    }

    setLoading(true);
    try {
      await transactionService.transfer({
        from_account: parseInt(transferData.from),
        to_account: parseInt(transferData.to),
        amount: amount
      });
      alert('Transfer successful!');
      setTransferData({ from: '', to: '', amount: '' });
      fetchAccounts();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (e) => {
    e.preventDefault();
    const amount = parseFloat(actionData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount greater than zero');
      return;
    }

    setLoading(true);
    try {
      const accountId = parseInt(actionData.account_id);
      if (activeTab === 'deposit') {
        await transactionService.deposit(accountId, amount);
        alert('Deposit successful!');
      } else {
        await transactionService.withdraw(accountId, amount);
        alert('Withdrawal successful!');
      }
      setActionData({ account_id: '', amount: '' });
      fetchAccounts();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transactions-page fade-in">
      <h1>Banking Actions</h1>
      <p className="subtitle">Move your money securely and instantly</p>

      <div className="tab-container glass-panel">
        <div className="tabs">
          <button className={activeTab === 'transfer' ? 'active' : ''} onClick={() => setActiveTab('transfer')}>Transfer</button>
          <button className={activeTab === 'deposit' ? 'active' : ''} onClick={() => setActiveTab('deposit')}>Deposit</button>
          <button className={activeTab === 'withdraw' ? 'active' : ''} onClick={() => setActiveTab('withdraw')}>Withdraw</button>
        </div>

        <div className="tab-content">
          {accounts.length === 0 && !loading && (
            <div className="auth-error" style={{ marginBottom: '1.5rem' }}>
              No accounts found. Please create an account in the Dashboard first.
            </div>
          )}
          {activeTab === 'transfer' ? (
            <form onSubmit={handleTransfer} className="action-form">
              <div className="form-group">
                <label>From Account</label>
                <select 
                  className="glass-input" 
                  value={transferData.from} 
                  onChange={e => setTransferData({...transferData, from: e.target.value})}
                  required
                >
                  <option value="" disabled>Select Account</option>
                  {accounts.map(a => (
                    <option key={a.account_id} value={a.account_id} style={{ background: '#0f172a', color: 'white' }}>
                      #{a.account_id} - {a.account_type.toUpperCase()} (${(parseFloat(a.balance) || 0).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Recipient Account ID</label>
                <input 
                  type="number" 
                  className="glass-input" 
                  placeholder="Enter recipient account number"
                  value={transferData.to}
                  onChange={e => setTransferData({...transferData, to: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input 
                  type="number" 
                  className="glass-input" 
                  placeholder="0.00"
                  value={transferData.amount}
                  onChange={e => setTransferData({...transferData, amount: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Processing...' : 'Complete Transfer'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleAction} className="action-form">
              <div className="form-group">
                <label>Target Account</label>
                <select 
                  className="glass-input" 
                  value={actionData.account_id} 
                  onChange={e => setActionData({...actionData, account_id: e.target.value})}
                  required
                >
                  <option value="" disabled>Select Account</option>
                  {accounts.map(a => (
                    <option key={a.account_id} value={a.account_id} style={{ background: '#0f172a', color: 'white' }}>
                      #{a.account_id} - {a.account_type.toUpperCase()} (${(parseFloat(a.balance) || 0).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input 
                  type="number" 
                  className="glass-input" 
                  placeholder="0.00"
                  value={actionData.amount}
                  onChange={e => setActionData({...actionData, amount: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Processing...' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Funds`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
