import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [view, setView] = useState('customers'); // 'customers', 'accounts', 'transfer', 'branches', 'employees'

  // Form states
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', address: '' });
  const [newAccount, setNewAccount] = useState({ customer_id: '', account_type: 'savings', balance: '' });
  const [transfer, setTransfer] = useState({ from: '', to: '', amount: '', type: 'transfer' });
  const [newBranch, setNewBranch] = useState({ branch_name: '', location: '' });
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '', branch_id: '' });

  const fetchData = async () => {
    try {
      const [cRes, aRes, tRes, bRes, eRes] = await Promise.all([
        fetch('http://localhost:5000/api/customers'),
        fetch('http://localhost:5000/api/accounts'),
        fetch('http://localhost:5000/api/transactions'),
        fetch('http://localhost:5000/api/branches'),
        fetch('http://localhost:5000/api/employees')
      ]);
      setCustomers(await cRes.json());
      setAccounts(await aRes.json());
      setTransactions(await tRes.json());
      setBranches(await bRes.json());
      setEmployees(await eRes.json());
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (url, data, setter, resetData) => {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    setter(resetData);
    fetchData();
  };

  return (
    <div className="dashboard">
      <nav className="sidebar">
        <h2>Nexus Bank</h2>
        <button onClick={() => setView('customers')} className={view === 'customers' ? 'active' : ''}>Customers</button>
        <button onClick={() => setView('accounts')} className={view === 'accounts' ? 'active' : ''}>Accounts</button>
        <button onClick={() => setView('transfer')} className={view === 'transfer' ? 'active' : ''}>Transfer</button>
        <div className="nav-separator">Administration</div>
        <button onClick={() => setView('branches')} className={view === 'branches' ? 'active' : ''}>Branches</button>
        <button onClick={() => setView('employees')} className={view === 'employees' ? 'active' : ''}>Employees</button>
      </nav>

      <main className="content">
        {view === 'customers' && (
          <section className="fade-in">
            <div className="header-row">
              <h1>Customers</h1>
              <div className="badge">{customers.length} Total</div>
            </div>
            
            <form className="glass-form" onSubmit={e => { e.preventDefault(); handleSubmit('http://localhost:5000/api/customers', newCustomer, setNewCustomer, { name: '', email: '', phone: '', address: '' }); }}>
              <input placeholder="Name" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} required />
              <input placeholder="Email" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} required />
              <input placeholder="Phone" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
              <button type="submit">Add Customer</button>
            </form>

            <div className="grid">
              {customers.map(c => (
                <div key={c.customer_id} className="card">
                  <h3>{c.name}</h3>
                  <p>{c.email}</p>
                  <span className="id-tag">ID: {c.customer_id}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {view === 'accounts' && (
          <section className="fade-in">
            <div className="header-row">
              <h1>Accounts</h1>
            </div>

            <form className="glass-form" onSubmit={e => { e.preventDefault(); handleSubmit('http://localhost:5000/api/accounts', newAccount, setNewAccount, { customer_id: '', account_type: 'savings', balance: '' }); }}>
              <select value={newAccount.customer_id} onChange={e => setNewAccount({...newAccount, customer_id: e.target.value})} required>
                <option value="">Select Customer</option>
                {customers.map(c => <option key={c.customer_id} value={c.customer_id}>{c.name}</option>)}
              </select>
              <select value={newAccount.account_type} onChange={e => setNewAccount({...newAccount, account_type: e.target.value})}>
                <option value="savings">Savings</option>
                <option value="current">Current</option>
              </select>
              <input placeholder="Initial Balance" type="number" value={newAccount.balance} onChange={e => setNewAccount({...newAccount, balance: e.target.value})} required />
              <button type="submit">Open Account</button>
            </form>

            <div className="grid">
              {accounts.map(a => (
                <div key={a.account_id} className="card account-card">
                  <div className="card-header">
                    <span className={`type-pill ${a.account_type}`}>{a.account_type}</span>
                  </div>
                  <h3>${parseFloat(a.balance).toLocaleString()}</h3>
                  <p>Owner: {a.customer_name}</p>
                  <p className="acc-id">Acc: #{a.account_id}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {view === 'transfer' && (
          <section className="fade-in">
            <h1>Transfers & Actions</h1>
            <form className="glass-form" onSubmit={e => { e.preventDefault(); handleSubmit('http://localhost:5000/api/transactions', { from_account: transfer.from, to_account: transfer.to, amount: transfer.amount, transaction_type: transfer.type }, setTransfer, { from: '', to: '', amount: '', type: 'transfer' }); }}>
              <select value={transfer.type} onChange={e => setTransfer({...transfer, type: e.target.value})}>
                <option value="transfer">Transfer</option>
                <option value="deposit">Deposit</option>
                <option value="withdraw">Withdraw</option>
              </select>
              
              {transfer.type !== 'deposit' && (
                <select value={transfer.from} onChange={e => setTransfer({...transfer, from: e.target.value})} required>
                  <option value="">From Account</option>
                  {accounts.map(a => <option key={a.account_id} value={a.account_id}>#{a.account_id} - {a.customer_name} (${a.balance})</option>)}
                </select>
              )}

              {transfer.type !== 'withdraw' && (
                <select value={transfer.to} onChange={e => setTransfer({...transfer, to: e.target.value})} required>
                  <option value="">To Account</option>
                  {accounts.map(a => <option key={a.account_id} value={a.account_id}>#{a.account_id} - {a.customer_name} (${a.balance})</option>)}
                </select>
              )}

              <input placeholder="Amount" type="number" value={transfer.amount} onChange={e => setTransfer({...transfer, amount: e.target.value})} required />
              <button type="submit">Execute {transfer.type}</button>
            </form>

            <div className="transaction-list">
              <h2>Recent Transactions</h2>
              {transactions.map(t => (
                <div key={t.transaction_id} className="transaction-item">
                  <span className={`type-pill ${t.transaction_type}`}>{t.transaction_type}</span>
                  <span className="amount">${t.amount}</span>
                  <span className="details">
                    {t.from_account ? `#${t.from_account}` : 'Cash'} → {t.to_account ? `#${t.to_account}` : 'Cash'}
                  </span>
                  <span className="date">{new Date(t.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {view === 'branches' && (
          <section className="fade-in">
            <div className="header-row">
              <h1>Branches</h1>
            </div>
            
            <form className="glass-form" onSubmit={e => { e.preventDefault(); handleSubmit('http://localhost:5000/api/branches', newBranch, setNewBranch, { branch_name: '', location: '' }); }}>
              <input placeholder="Branch Name" value={newBranch.branch_name} onChange={e => setNewBranch({...newBranch, branch_name: e.target.value})} required />
              <input placeholder="Location" value={newBranch.location} onChange={e => setNewBranch({...newBranch, location: e.target.value})} required />
              <button type="submit">Add Branch</button>
            </form>

            <div className="grid">
              {branches.map(b => (
                <div key={b.branch_id} className="card">
                  <h3>{b.branch_name}</h3>
                  <p>{b.location}</p>
                  <span className="id-tag">B-ID: {b.branch_id}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {view === 'employees' && (
          <section className="fade-in">
            <div className="header-row">
              <h1>Employees</h1>
            </div>
            
            <form className="glass-form" onSubmit={e => { e.preventDefault(); handleSubmit('http://localhost:5000/api/employees', newEmployee, setNewEmployee, { name: '', role: '', branch_id: '' }); }}>
              <input placeholder="Name" value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} required />
              <input placeholder="Role" value={newEmployee.role} onChange={e => setNewEmployee({...newEmployee, role: e.target.value})} required />
              <select value={newEmployee.branch_id} onChange={e => setNewEmployee({...newEmployee, branch_id: e.target.value})} required>
                <option value="">Select Branch</option>
                {branches.map(b => <option key={b.branch_id} value={b.branch_id}>{b.branch_name}</option>)}
              </select>
              <button type="submit">Add Employee</button>
            </form>

            <div className="grid">
              {employees.map(e => (
                <div key={e.employee_id} className="card">
                  <h3>{e.name}</h3>
                  <p>{e.role}</p>
                  <span className="badge">{e.branch_name}</span>
                  <span className="id-tag">E-ID: {e.employee_id}</span>
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
