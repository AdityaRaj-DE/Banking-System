import { useState, useEffect } from 'react'
import './index.css'

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState('dashboard');
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Auth States
  const [isLogin, setIsLogin] = useState(true);
  const [authData, setAuthData] = useState({ name: '', email: '', password: '', phone: '', address: '' });

  // Action States
  const [transferData, setTransferData] = useState({ from: '', to: '', amount: '' });
  const [depositData, setDepositData] = useState({ account_id: '', amount: '' });

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/customers/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        fetchAccounts();
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAccounts = async () => {
    const res = await fetch(`${API_BASE}/accounts`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setAccounts(data);
    if (data.length > 0) {
      fetchTransactions(data[0].account_id);
    }
  };

  const fetchTransactions = async (accountId) => {
    const res = await fetch(`${API_BASE}/transactions/history/${accountId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setTransactions(data);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authData)
    });
    const data = await res.json();
    if (res.ok) {
      if (isLogin) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
      } else {
        setIsLogin(true);
        alert('Registered successfully! Please login.');
      }
    } else {
      alert(data.error || data.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/transactions/transfer`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        from_account_id: transferData.from,
        to_account_id: transferData.to,
        amount: transferData.amount
      })
    });
    if (res.ok) {
      alert('Transfer Successful');
      fetchAccounts();
    } else {
      const err = await res.json();
      alert(err.error);
    }
  };

  const openAccount = async () => {
    const type = prompt('Account Type (savings/current):', 'savings');
    if (!type) return;
    await fetch(`${API_BASE}/accounts`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ account_type: type, initial_balance: 0 })
    });
    fetchAccounts();
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card fade-in">
          <h2>Nexus Bank</h2>
          <p>{isLogin ? 'Welcome back' : 'Create your account'}</p>
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            {!isLogin && (
              <input 
                placeholder="Full Name" 
                className="glass-input" 
                value={authData.name} 
                onChange={e => setAuthData({...authData, name: e.target.value})} 
                required 
              />
            )}
            <input 
              placeholder="Email" 
              type="email" 
              value={authData.email} 
              onChange={e => setAuthData({...authData, email: e.target.value})} 
              required 
            />
            <input 
              placeholder="Password" 
              type="password" 
              value={authData.password} 
              onChange={e => setAuthData({...authData, password: e.target.value})} 
              required 
            />
            <button type="submit" className="primary-btn">{isLogin ? 'Login' : 'Sign Up'}</button>
          </form>
          <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#94a3b8', marginTop: '1rem', cursor: 'pointer' }}>
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <nav className="sidebar">
        <h2>Nexus Bank</h2>
        <button onClick={() => setView('dashboard')} className={view === 'dashboard' ? 'active' : ''}>Dashboard</button>
        <button onClick={() => setView('transfer')} className={view === 'transfer' ? 'active' : ''}>Transfer</button>
        <button onClick={() => setView('history')} className={view === 'history' ? 'active' : ''}>History</button>
        <div style={{ flex: 1 }}></div>
        <div className="user-profile">
          <p>{user?.name}</p>
          <button onClick={handleLogout} style={{ color: '#ef4444', padding: 0 }}>Logout</button>
        </div>
      </nav>

      <main className="content">
        {view === 'dashboard' && (
          <section className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1>Dashboard</h1>
              <button onClick={openAccount} className="primary-btn">+ Open New Account</button>
            </div>

            <div className="grid">
              {accounts.map(acc => (
                <div key={acc.account_id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="badge">{acc.account_type}</span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>#{acc.account_id}</span>
                  </div>
                  <h2 style={{ fontSize: '2rem', margin: '1rem 0' }}>${parseFloat(acc.balance).toLocaleString()}</h2>
                  <p>Status: <span style={{ color: acc.status === 'active' ? '#10b981' : '#ef4444' }}>{acc.status}</span></p>
                </div>
              ))}
            </div>

            {accounts.length === 0 && <p>No accounts found. Open one to get started!</p>}
          </section>
        )}

        {view === 'transfer' && (
          <section className="fade-in">
            <h1>Fund Transfer</h1>
            <div className="glass-form">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>From Account</label>
                <select value={transferData.from} onChange={e => setTransferData({...transferData, from: e.target.value})}>
                  <option value="">Select Account</option>
                  {accounts.map(a => <option key={a.account_id} value={a.account_id}>#{a.account_id} - ${a.balance}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Recipient Account ID</label>
                <input placeholder="Enter Account ID" value={transferData.to} onChange={e => setTransferData({...transferData, to: e.target.value})} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Amount</label>
                <input type="number" placeholder="0.00" value={transferData.amount} onChange={e => setTransferData({...transferData, amount: e.target.value})} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button onClick={handleTransfer} className="primary-btn" style={{ width: '100%' }}>Send Money</button>
              </div>
            </div>
          </section>
        )}

        {view === 'history' && (
          <section className="fade-in">
            <h1>Transaction History</h1>
            <select 
              style={{ marginBottom: '1.5rem', background: '#1e293b', color: 'white', border: '1px solid #334155', padding: '0.5rem' }}
              onChange={(e) => fetchTransactions(e.target.value)}
            >
              <option value="">Select Account</option>
              {accounts.map(a => <option key={a.account_id} value={a.account_id}>#{a.account_id}</option>)}
            </select>

            <div className="transaction-list">
              <div className="transaction-item" style={{ fontWeight: 'bold', background: 'rgba(255,255,255,0.05)' }}>
                <span>Type</span>
                <span>Details</span>
                <span>Status</span>
                <span>Amount</span>
              </div>
              {transactions.map(t => (
                <div key={t.transaction_id} className="transaction-item">
                  <span className={`type-pill ${t.transaction_type}`}>{t.transaction_type}</span>
                  <span>{t.from_account ? `#${t.from_account}` : 'Ext'} → {t.to_account ? `#${t.to_account}` : 'Ext'}</span>
                  <span style={{ color: t.status === 'completed' ? '#10b981' : '#f59e0b' }}>{t.status}</span>
                  <span style={{ fontWeight: 'bold' }}>${t.amount}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
