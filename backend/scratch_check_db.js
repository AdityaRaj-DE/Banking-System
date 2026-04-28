import pool from './config/db.js';

async function check() {
  try {
    const [rows] = await pool.query('SHOW TABLES');
    console.log('Tables in database:', rows.map(r => Object.values(r)[0]));
    
    const [accounts] = await pool.query('SELECT * FROM accounts');
    console.log('Accounts in DB:', accounts);
    
    const [transactions] = await pool.query('SELECT * FROM transactions LIMIT 1');
    console.log('Transactions table accessible');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit();
  }
}

check();
