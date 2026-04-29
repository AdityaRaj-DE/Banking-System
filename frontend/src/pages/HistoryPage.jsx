import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import accountService from '../services/accountService';
import transactionService from '../services/transactionService';

const HistoryPage = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    if (user) fetchAccounts();
  }, [user]);

  const fetchAccounts = async () => {
    try {
      const customerId = user.id || user.customer_id;
      const res = await accountService.getAccountsByCustomerId(customerId);
      const accs = Array.isArray(res.data) ? res.data : [];
      setAccounts(accs);
      if (accs.length > 0) {
        setSelectedAccount(accs[0].account_id);
        fetchHistory(accs[0].account_id);
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to fetch accounts", "error");
    }
  };

  const fetchHistory = async (accountId) => {
    setLoading(true);
    try {
      const res = await transactionService.getHistory(accountId);
      setTransactions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      showNotification("Failed to fetch transaction history", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAccountChange = (e) => {
    const id = e.target.value;
    setSelectedAccount(id);
    if (id) fetchHistory(id);
  };

  const filteredTransactions = transactions.filter(t => {
    const desc = t.from_account && t.to_account ? 
      (String(t.from_account) === String(selectedAccount) ? `Sent to #${t.to_account}` : `Received from #${t.from_account}`) : 
      (t.transaction_type === 'deposit' ? 'Cash Deposit' : 'Cash Withdrawal');
    
    return desc.toLowerCase().includes(filterText.toLowerCase()) || 
           t.transaction_type.toLowerCase().includes(filterText.toLowerCase()) ||
           String(t.amount).includes(filterText);
  });

  return (
    <div className="history-page fade-in">
      <header className="page-header" style={{ marginBottom: '2rem' }}>
        <h1>Transaction History</h1>
        <p className="subtitle">Track your income and expenses across accounts</p>
      </header>

      <div className="filter-section card-panel" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label className="text-label">Select Account:</label>
          <select 
            className="input-field" 
            style={{ width: 'auto', minWidth: '250px' }}
            value={selectedAccount}
            onChange={handleAccountChange}
          >
            {accounts.map(a => <option key={a.account_id} value={a.account_id}>#{a.account_id} - {a.account_type.toUpperCase()} (₹{parseFloat(a.balance).toLocaleString()})</option>)}
          </select>
        </div>
        
        <div style={{ flex: 1 }}></div>
        
        <div className="search-bar">
          <div className="input-with-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Filter by description..." 
              style={{ width: '250px', paddingLeft: '2.5rem' }} 
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: '6rem', textAlign: 'center' }}>
              <div className="loader"></div>
              <p style={{ marginTop: '1.5rem', color: 'var(--on-surface-variant)', fontWeight: '600' }}>Fetching transaction records...</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--background)' }}>
                  <th style={{ textAlign: 'left', padding: '1.5rem', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.05em' }}>Transaction Date</th>
                  <th style={{ textAlign: 'left', padding: '1.5rem', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.05em' }}>Type</th>
                  <th style={{ textAlign: 'left', padding: '1.5rem', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.05em' }}>Description</th>
                  <th style={{ textAlign: 'left', padding: '1.5rem', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.05em' }}>Amount</th>
                  <th style={{ textAlign: 'left', padding: '1.5rem', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.05em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? filteredTransactions.map(t => (
                  <tr key={t.transaction_id} className="table-row-hover" style={{ borderBottom: '1px solid var(--background)' }}>
                    <td style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '700', color: 'var(--secondary)' }}>{new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>{new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem' }}>
                      <span className={`badge ${t.transaction_type === 'deposit' ? 'badge-success' : t.transaction_type === 'withdraw' ? 'badge-error' : 'badge-primary'}`}>
                        {t.transaction_type}
                      </span>
                    </td>
                    <td style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--primary)' }}>
                          {t.transaction_type === 'transfer' ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"/></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>}
                        </div>
                        <span style={{ fontWeight: '600', color: 'var(--secondary)' }}>
                          {t.from_account && t.to_account ? (
                            String(t.from_account) === String(selectedAccount) ? `Sent to #${t.to_account}` : `Received from #${t.from_account}`
                          ) : t.transaction_type === 'deposit' ? 'Cash Deposit' : 'Cash Withdrawal'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem' }}>
                      <span style={{ fontWeight: '800', fontSize: '1rem', color: t.transaction_type === 'deposit' || (t.to_account && String(t.to_account) === String(selectedAccount)) ? 'var(--success)' : 'var(--secondary)' }}>
                        {t.transaction_type === 'deposit' || (t.to_account && String(t.to_account) === String(selectedAccount)) ? '+' : '-'}₹{parseFloat(t.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.status === 'completed' ? 'var(--success)' : 'var(--primary)' }}></div>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', textTransform: 'capitalize', color: 'var(--secondary)' }}>{t.status}</span>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '6rem' }}>
                      <div style={{ opacity: 0.3, marginBottom: '1.5rem' }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      </div>
                      <p style={{ color: 'var(--on-surface-variant)', fontWeight: '600' }}>No transaction history found for this account.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      <style>{`
        .table-row-hover:hover {
          background-color: rgba(77, 68, 181, 0.02);
        }
      `}</style>
    </div>
  );
};

export default HistoryPage;
