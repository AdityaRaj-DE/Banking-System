import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import accountService from '../services/accountService';
import transactionService from '../services/transactionService';

const HistoryPage = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchAccounts();
  }, [user]);

  const fetchAccounts = async () => {
    try {
      const res = await accountService.getAccountsByCustomerId(user.id);
      setAccounts(res.data);
      if (res.data.length > 0) {
        setSelectedAccount(res.data[0].account_id);
        fetchHistory(res.data[0].account_id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async (accountId) => {
    setLoading(true);
    try {
      const res = await transactionService.getHistory(accountId);
      setTransactions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountChange = (e) => {
    const id = e.target.value;
    setSelectedAccount(id);
    if (id) fetchHistory(id);
  };

  return (
    <div className="history-page fade-in">
      <header className="page-header" style={{ marginBottom: '2rem' }}>
        <h1>Transaction History</h1>
        <p className="subtitle">Track your income and expenses across accounts</p>
      </header>

      <div className="filter-section glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <label style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Select Account:</label>
        <select 
          className="glass-input" 
          style={{ width: 'auto', minWidth: '200px' }}
          value={selectedAccount}
          onChange={handleAccountChange}
        >
          <option value="">Select an account</option>
          {accounts.map(a => <option key={a.account_id} value={a.account_id}>#{a.account_id} ({a.account_type})</option>)}
        </select>
      </div>

      <div className="history-table-container glass-panel" style={{ padding: '1rem' }}>
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center' }}>Loading history...</p>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Details</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.transaction_id}>
                  <td>{new Date(t.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${t.transaction_type === 'deposit' ? 'badge-success' : t.transaction_type === 'withdraw' ? 'badge-error' : 'badge-primary'}`}>
                      {t.transaction_type}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.9rem' }}>
                    {t.from_account && t.to_account ? (
                      <span>#{t.from_account} → #{t.to_account}</span>
                    ) : t.transaction_type === 'deposit' ? (
                      <span>Direct Deposit</span>
                    ) : (
                      <span>Cash Withdrawal</span>
                    )}
                  </td>
                  <td style={{ fontWeight: '700', color: t.transaction_type === 'deposit' ? 'var(--success)' : 'var(--text-primary)' }}>
                    {t.transaction_type === 'deposit' ? '+' : '-'}${parseFloat(t.amount).toLocaleString()}
                  </td>
                  <td>
                    <span className={`badge ${t.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No transactions found for this account.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
