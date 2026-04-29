import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function check() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Root@12345',
    database: process.env.DB_NAME || 'banking_system',
  });

  const customerId = 1; // Assuming there is at least one customer

  try {
    const queries = {
      totalBalance: `SELECT SUM(balance) as total FROM accounts WHERE customer_id = ?`,
      monthlyInflow: `
        SELECT SUM(amount) as total FROM transactions 
        WHERE to_account IN (SELECT account_id FROM accounts WHERE customer_id = ?)
        AND (transaction_type = 'deposit' OR transaction_type = 'transfer')
        AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        AND status = 'completed'`,
      monthlyOutflow: `
        SELECT SUM(amount) as total FROM transactions 
        WHERE from_account IN (SELECT account_id FROM accounts WHERE customer_id = ?)
        AND (transaction_type = 'withdraw' OR transaction_type = 'transfer')
        AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        AND status = 'completed'`,
      lastTransaction: `
        SELECT created_at FROM transactions 
        WHERE from_account IN (SELECT account_id FROM accounts WHERE customer_id = ?)
        OR to_account IN (SELECT account_id FROM accounts WHERE customer_id = ?)
        ORDER BY created_at DESC LIMIT 1`,
      dailyTransferUsage: `
        SELECT SUM(amount) as total FROM transactions 
        WHERE from_account IN (SELECT account_id FROM accounts WHERE customer_id = ?)
        AND transaction_type = 'transfer'
        AND DATE(created_at) = CURDATE()
        AND status = 'completed'`,
      monthlyWithdrawalUsage: `
        SELECT SUM(amount) as total FROM transactions 
        WHERE from_account IN (SELECT account_id FROM accounts WHERE customer_id = ?)
        AND transaction_type = 'withdraw'
        AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        AND status = 'completed'`
    };

    for (const [key, sql] of Object.entries(queries)) {
      console.log(`Checking ${key}...`);
      const params = key === 'lastTransaction' ? [customerId, customerId] : [customerId];
      const [rows] = await pool.query(sql, params);
      console.log(`${key} result:`, rows[0]);
    }
    console.log("All queries passed!");
  } catch (err) {
    console.error("SQL Error:", err.message);
  } finally {
    await pool.end();
  }
}

check();
