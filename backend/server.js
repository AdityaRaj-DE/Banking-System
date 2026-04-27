import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Banking Backend is running' });
});

// Customers
app.get('/api/customers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/customers', async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
      [name, email, phone, address]
    );
    res.status(201).json({ id: result.insertId, name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Accounts
app.get('/api/accounts', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT a.*, c.name as customer_name FROM accounts a JOIN customers c ON a.customer_id = c.customer_id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/accounts', async (req, res) => {
  const { customer_id, account_type, balance } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO accounts (customer_id, account_type, balance, status) VALUES (?, ?, ?, ?)',
      [customer_id, account_type, balance || 0, 'active']
    );
    res.status(201).json({ id: result.insertId, customer_id, balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Transactions (Transfer/Deposit/Withdraw)
app.post('/api/transactions', async (req, res) => {
  const { from_account, to_account, amount, transaction_type } = req.body;
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    if (transaction_type === 'transfer') {
      // Deduct from sender
      await connection.query('UPDATE accounts SET balance = balance - ? WHERE account_id = ?', [amount, from_account]);
      // Add to receiver
      await connection.query('UPDATE accounts SET balance = balance + ? WHERE account_id = ?', [amount, to_account]);
    } else if (transaction_type === 'deposit') {
      await connection.query('UPDATE accounts SET balance = balance + ? WHERE account_id = ?', [amount, to_account]);
    } else if (transaction_type === 'withdraw') {
      await connection.query('UPDATE accounts SET balance = balance - ? WHERE account_id = ?', [amount, from_account]);
    }

    // Record transaction
    await connection.query(
      'INSERT INTO transactions (from_account, to_account, amount, transaction_type) VALUES (?, ?, ?, ?)',
      [from_account || null, to_account || null, amount, transaction_type]
    );

    await connection.commit();
    res.json({ message: 'Transaction successful' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC LIMIT 50');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Branches
app.get('/api/branches', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM branch');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/branches', async (req, res) => {
  const { branch_name, location } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO branch (branch_name, location) VALUES (?, ?)', [branch_name, location]);
    res.status(201).json({ id: result.insertId, branch_name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Employees
app.get('/api/employees', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT e.*, b.branch_name FROM employees e JOIN branch b ON e.branch_id = b.branch_id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/employees', async (req, res) => {
  const { name, role, branch_id } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO employees (name, role, branch_id) VALUES (?, ?, ?)', [name, role, branch_id]);
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
