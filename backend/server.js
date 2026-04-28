import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.use(cors());
app.use(express.json());

// --- Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO customers (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, address]
    );
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM customers WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.customer_id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.customer_id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Customer Routes ---
app.get('/api/customers/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT customer_id, name, email, phone, address FROM customers WHERE customer_id = ?', [req.user.id]);
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Account Routes ---
app.get('/api/accounts', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM accounts WHERE customer_id = ?', [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/accounts', authenticateToken, async (req, res) => {
  const { account_type, initial_balance } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO accounts (customer_id, account_type, balance, status) VALUES (?, ?, ?, ?)',
      [req.user.id, account_type, initial_balance || 0, 'active']
    );
    res.status(201).json({ id: result.insertId, account_type, balance: initial_balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Transaction Routes (DBMS Centric) ---
app.post('/api/transactions/transfer', authenticateToken, async (req, res) => {
  const { from_account_id, to_account_id, amount } = req.body;
  
  try {
    // Calling the stored procedure for atomicity and performance
    await pool.query('CALL TransferMoney(?, ?, ?)', [from_account_id, to_account_id, amount]);
    res.json({ message: 'Transfer successful' });
  } catch (err) {
    console.error('Transfer error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/transactions/deposit', authenticateToken, async (req, res) => {
  const { account_id, amount } = req.body;
  try {
    await pool.query('CALL DepositMoney(?, ?)', [account_id, amount]);
    res.json({ message: 'Deposit successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/transactions/history/:accountId', authenticateToken, async (req, res) => {
  const { accountId } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM transactions WHERE from_account = ? OR to_account = ? ORDER BY created_at DESC',
      [accountId, accountId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Audit & Logs (Admin feature simulation) ---
app.get('/api/admin/audit-logs', authenticateToken, async (req, res) => {
  // In a real app, check if user is admin
  try {
    const [rows] = await pool.query('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Banking Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
