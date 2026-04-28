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

      <div className="filter-section card-panel" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <label style={{ fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)' }}>Select Account:</label>
        <select 
          className="input-field" 
          style={{ width: 'auto', minWidth: '250px' }}
          value={selectedAccount}
          onChange={handleAccountChange}
        >
          <option value="">Select an account</option>
          {accounts.map(a => <option key={a.account_id} value={a.account_id}>#{a.account_id} ({a.account_type.toUpperCase()})</option>)}
        </select>
      </div>

      <div className="history-table-container card-panel" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="loading-screen" style={{ height: 'auto' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--on-surface-variant)' }}>Fetching history...</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--outline-variant)' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>Details</th>
                <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--on-surface-variant)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.transaction_id} style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                  <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem' }}>{new Date(t.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span className={`badge ${t.transaction_type === 'deposit' ? 'badge-success' : t.transaction_type === 'withdraw' ? 'badge-error' : 'badge-primary'}`}>
                      {t.transaction_type}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', color: 'var(--secondary)', fontWeight: '500' }}>
                    {t.from_account && t.to_account ? (
                      <span>#{t.from_account} → #{t.to_account}</span>
                    ) : t.transaction_type === 'deposit' ? (
                      <span>Direct Deposit</span>
                    ) : (
                      <span>Cash Withdrawal</span>
                    )}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', fontWeight: '700', color: t.transaction_type === 'deposit' ? 'var(--success)' : 'var(--secondary)' }}>
                    {t.transaction_type === 'deposit' ? '+' : '-'}₹{parseFloat(t.amount).toLocaleString()}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span className={`badge ${t.status === 'completed' ? 'badge-success' : 'badge-primary'}`} style={{ opacity: t.status === 'completed' ? 1 : 0.6 }}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--on-surface-variant)' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    </div>
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
