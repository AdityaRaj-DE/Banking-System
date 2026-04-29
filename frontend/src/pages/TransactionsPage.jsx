import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import accountService from '../services/accountService';
import transactionService from '../services/transactionService';
import './Transactions.css';

const TransactionsPage = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const location = useLocation();
  const [accounts, setAccounts] = useState([]);
  const [activeTab, setActiveTab] = useState('transfer');
  const [loading, setLoading] = useState(false);

  // Form states
  const [transferData, setTransferData] = useState({ from: '', to: '', amount: '', note: '' });
  const [actionData, setActionData] = useState({ account_id: '', amount: '' });

  useEffect(() => {
    if (user) fetchAccounts();
    
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['transfer', 'deposit', 'withdraw'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [user, location]);

  const fetchAccounts = async () => {
    try {
      const customerId = user.id || user.customer_id;
      const res = await accountService.getAccountsByCustomerId(customerId);
      const accs = Array.isArray(res.data) ? res.data : [];
      setAccounts(accs);
      
      // Auto-select first account if none selected
      if (accs.length > 0) {
        if (!transferData.from) setTransferData(prev => ({ ...prev, from: accs[0].account_id }));
        if (!actionData.account_id) setActionData(prev => ({ ...prev, account_id: accs[0].account_id }));
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to fetch accounts", "error");
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const amount = parseFloat(transferData.amount);
    if (isNaN(amount) || amount <= 0) {
      showNotification('Please enter a valid amount', 'warning');
      return;
    }

    setLoading(true);
    try {
      await transactionService.transfer({
        from_account: parseInt(transferData.from),
        to_account: parseInt(transferData.to),
        amount: amount
      });
      showNotification('Transfer completed successfully!', 'success');
      setTransferData({ from: transferData.from, to: '', amount: '', note: '' });
      fetchAccounts();
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (e) => {
    e.preventDefault();
    const amount = parseFloat(actionData.amount);
    if (isNaN(amount) || amount <= 0) {
      showNotification('Please enter a valid amount', 'warning');
      return;
    }

    setLoading(true);
    try {
      const accountId = parseInt(actionData.account_id);
      if (activeTab === 'deposit') {
        await transactionService.deposit(accountId, amount);
        showNotification('Deposit successful!', 'success');
      } else {
        await transactionService.withdraw(accountId, amount);
        showNotification('Withdrawal successful!', 'success');
      }
      setActionData({ account_id: actionData.account_id, amount: '' });
      fetchAccounts();
    } catch (err) {
      showNotification(err.response?.data?.message || err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectedFromAccount = accounts.find(a => String(a.account_id) === String(transferData.from));
  const actionAccount = accounts.find(a => String(a.account_id) === String(actionData.account_id));

  return (
    <div className="transactions-page fade-in">
      <header className="page-header">
        <h1>{activeTab === 'transfer' ? 'Initiate Transfer' : 'Fund Management'}</h1>
        <p className="subtitle">Move funds securely across your accounts or to external recipients.</p>
      </header>

      <div className="tabs-header">
        <button className={`tab-btn ${activeTab === 'transfer' ? 'active' : ''}`} onClick={() => setActiveTab('transfer')}>Transfer Money</button>
        <button className={`tab-btn ${activeTab === 'deposit' ? 'active' : ''}`} onClick={() => setActiveTab('deposit')}>Deposit Funds</button>
        <button className={`tab-btn ${activeTab === 'withdraw' ? 'active' : ''}`} onClick={() => setActiveTab('withdraw')}>Withdraw Funds</button>
      </div>

      {activeTab === 'transfer' ? (
        <div className="transaction-layout">
          <div className="initiate-section">
            <div className="card-panel form-card">
              <form onSubmit={handleTransfer} className="form-grid">
                <div className="input-group">
                  <label>From Account</label>
                  <div className="account-selector">
                    {accounts.length > 0 ? accounts.map(a => (
                      <div 
                        key={a.account_id} 
                        className={`account-option ${String(transferData.from) === String(a.account_id) ? 'selected' : ''}`}
                        onClick={() => setTransferData({ ...transferData, from: a.account_id })}
                      >
                        <div>
                          <p className="text-sm font-bold">{a.account_type.toUpperCase()}</p>
                          <p className="text-xs" style={{ opacity: 0.7 }}>**** {String(a.account_id).slice(-4)}</p>
                        </div>
                        <p className="font-bold">₹{parseFloat(a.balance).toLocaleString()}</p>
                      </div>
                    )) : (
                      <p className="text-sm" style={{ padding: '1rem', color: 'var(--error)' }}>No accounts found. Please create one in Dashboard.</p>
                    )}
                  </div>
                </div>

                <div className="input-group">
                  <label>To Recipient</label>
                  <div className="recipient-search">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input 
                      type="number" 
                      className="input-field" 
                      placeholder="Search by account number..."
                      value={transferData.to}
                      onChange={e => setTransferData({...transferData, to: e.target.value})}
                      required
                    />
                  </div>
                  <div className="quick-recipients">
                    <div className="recipient-chip"><div className="recipient-avatar">AJ</div> Sarah Jenkins</div>
                    <div className="recipient-chip"><div className="recipient-avatar">AW</div> Apex Wealth</div>
                  </div>
                </div>

                <div className="input-group">
                  <label>Amount</label>
                  <div className="amount-input-wrapper">
                    <span className="currency-symbol">₹</span>
                    <input 
                      type="number" 
                      className="input-field amount-input" 
                      placeholder="0.00"
                      value={transferData.amount}
                      onChange={e => setTransferData({...transferData, amount: e.target.value})}
                      required
                    />
                    <span className="currency-label">INR</span>
                  </div>
                </div>

                <div className="input-group">
                  <label>Note / Reference (Optional)</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Q3 Invoice Payment"
                    value={transferData.note}
                    onChange={e => setTransferData({...transferData, note: e.target.value})}
                  />
                </div>
              </form>
            </div>
          </div>

          <div className="review-section">
            <div className="card-panel review-card">
              <h3>Review Transfer</h3>
              <div style={{ marginTop: '2rem' }}>
                <div className="review-item">
                  <span className="review-label">Transfer Date</span>
                  <span className="review-value">Today, {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Transfer Fee</span>
                  <span className="review-value">₹0.00</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Estimated Arrival</span>
                  <span className="review-value">Instant</span>
                </div>
                
                <div className="total-review">
                  <div>
                    <p className="review-label">Total Amount</p>
                    <h2>₹{parseFloat(transferData.amount || 0).toLocaleString()}</h2>
                  </div>
                </div>

                <div className="info-alert">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  <p>Transfers submitted after 5:00 PM EST will be processed on the next business day.</p>
                </div>

                <button 
                  className="primary-btn" 
                  style={{ width: '100%', padding: '1rem' }}
                  onClick={handleTransfer}
                  disabled={loading || !transferData.to || !transferData.amount}
                >
                  {loading ? <div className="loader" style={{ width: '20px', height: '20px' }}></div> : (
                    <>
                      Send Money
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="fund-management-grid">
          <div className="card-panel form-card">
            <h3>{activeTab === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--on-surface-variant)' }}>
              {activeTab === 'deposit' ? 'Add money to your account instantly.' : 'Withdraw funds to your linked bank account.'}
            </p>
            
            <form onSubmit={handleAction} className="form-grid">
              <div className="input-group">
                <label>Target Account</label>
                <div className="account-selector">
                  {accounts.length > 0 ? accounts.map(a => (
                    <div 
                      key={a.account_id} 
                      className={`account-option ${String(actionData.account_id) === String(a.account_id) ? 'selected' : ''}`}
                      onClick={() => setActionData({ ...actionData, account_id: a.account_id })}
                    >
                      <div>
                        <p className="text-sm font-bold">{a.account_type.toUpperCase()}</p>
                        <p className="text-xs" style={{ opacity: 0.7 }}>**** {String(a.account_id).slice(-4)}</p>
                      </div>
                      <p className="font-bold">₹{parseFloat(a.balance).toLocaleString()}</p>
                    </div>
                  )) : (
                    <p className="text-sm" style={{ padding: '1rem', color: 'var(--error)' }}>No accounts found.</p>
                  )}
                </div>
              </div>
              
              <div className="input-group">
                <label>Amount</label>
                <div className="amount-input-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input 
                    type="number" 
                    className="input-field amount-input" 
                    placeholder="0.00"
                    value={actionData.amount}
                    onChange={e => setActionData({...actionData, amount: e.target.value})}
                    required
                  />
                  <span className="currency-label">INR</span>
                </div>
              </div>
              
              <button type="submit" className="primary-btn" disabled={loading} style={{ padding: '1rem' }}>
                {loading ? <div className="loader" style={{ width: '20px', height: '20px' }}></div> : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Funds`}
              </button>
            </form>
          </div>

          <div className="card-panel limit-card">
            <h4>Daily Limits</h4>
            <div className="limit-item-box">
              <div className="limit-item">
                <span className="limit-label">Daily Transfer Limit</span>
                <span className="limit-value">₹50,000 / ₹1,00,000</span>
              </div>
              <div className="limit-bar-bg"><div className="limit-bar-fill" style={{ width: '50%' }}></div></div>
            </div>
            
            <div className="limit-item-box" style={{ marginTop: '2rem' }}>
              <div className="limit-item">
                <span className="limit-label">Monthly Withdrawal Limit</span>
                <span className="limit-value">₹2,00,000 / ₹5,00,000</span>
              </div>
              <div className="limit-bar-bg"><div className="limit-bar-fill" style={{ width: '40%' }}></div></div>
            </div>

            <div className="info-alert" style={{ marginTop: '2rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <p>Contact support if you need to increase your transaction limits.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
