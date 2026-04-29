import pool from '../config/db.js';

class AccountRepository {
  async create(accountData) {
    const { customer_id, account_type, balance, status } = accountData;
    const [result] = await pool.query(
      'INSERT INTO accounts (customer_id, account_type, balance, status) VALUES (?, ?, ?, ?)',
      [customer_id, account_type, balance || 0, status || 'active']
    );
    return result.insertId;
  }

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM accounts WHERE account_id = ?', [id]);
    return rows[0];
  }

  async findByCustomerId(customerId) {
    const [rows] = await pool.query('SELECT * FROM accounts WHERE customer_id = ?', [customerId]);
    return rows;
  }

  async updateStatus(id, status) {
    const [result] = await pool.query('UPDATE accounts SET status = ? WHERE account_id = ?', [status, id]);
    return result.affectedRows > 0;
  }

  async updateBalance(id, amount, connection = pool) {
    const [result] = await connection.query('UPDATE accounts SET balance = balance + ? WHERE account_id = ?', [amount, id]);
    return result.affectedRows > 0;
  }

  async getStatsByCustomerId(customerId) {
    try {
      const queries = {
        totalBalance: `SELECT SUM(balance) as total FROM accounts WHERE customer_id = ?`,
        monthlyInflow: `
          SELECT SUM(t.amount) as total 
          FROM transactions t
          JOIN accounts a ON t.to_account = a.account_id
          WHERE a.customer_id = ?
          AND (t.transaction_type = 'deposit' OR t.transaction_type = 'transfer')
          AND t.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          AND t.status = 'completed'`,
        monthlyOutflow: `
          SELECT SUM(t.amount) as total 
          FROM transactions t
          JOIN accounts a ON t.from_account = a.account_id
          WHERE a.customer_id = ?
          AND (t.transaction_type = 'withdraw' OR t.transaction_type = 'transfer')
          AND t.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          AND t.status = 'completed'`,
        lastTransaction: `
          SELECT t.created_at 
          FROM transactions t
          JOIN accounts a ON (t.from_account = a.account_id OR t.to_account = a.account_id)
          WHERE a.customer_id = ?
          ORDER BY t.created_at DESC LIMIT 1`,
        dailyTransferUsage: `
          SELECT SUM(t.amount) as total 
          FROM transactions t
          JOIN accounts a ON t.from_account = a.account_id
          WHERE a.customer_id = ?
          AND t.transaction_type = 'transfer'
          AND DATE(t.created_at) = CURDATE()
          AND t.status = 'completed'`,
        monthlyWithdrawalUsage: `
          SELECT SUM(t.amount) as total 
          FROM transactions t
          JOIN accounts a ON t.from_account = a.account_id
          WHERE a.customer_id = ?
          AND t.transaction_type = 'withdraw'
          AND t.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          AND t.status = 'completed'`
      };

      const results = {};
      for (const [key, sql] of Object.entries(queries)) {
        const [rows] = await pool.query(sql, [customerId]);
        results[key] = rows[0]?.total || rows[0]?.created_at || 0;
      }

      // Calculate trend percentage
      const current = parseFloat(results.totalBalance || 0);
      const inflow = parseFloat(results.monthlyInflow || 0);
      const outflow = parseFloat(results.monthlyOutflow || 0);
      const netChange = inflow - outflow;
      const previousBalance = current - netChange;
      
      results.balanceTrend = previousBalance > 0 ? (netChange / previousBalance) * 100 : 0;
      
      return results;
    } catch (err) {
      console.error('Error in getStatsByCustomerId:', err);
      throw err;
    }
  }

  async getStatsByAccountId(accountId) {
    try {
      const queries = {
        balance: `SELECT balance FROM accounts WHERE account_id = ?`,
        monthlyInflow: `
          SELECT SUM(amount) as total FROM transactions 
          WHERE to_account = ?
          AND (transaction_type = 'deposit' OR transaction_type = 'transfer')
          AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          AND status = 'completed'`,
        monthlyOutflow: `
          SELECT SUM(amount) as total FROM transactions 
          WHERE from_account = ?
          AND (transaction_type = 'withdraw' OR transaction_type = 'transfer')
          AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          AND status = 'completed'`,
        lastTransaction: `
          SELECT created_at FROM transactions 
          WHERE from_account = ? OR to_account = ?
          ORDER BY created_at DESC LIMIT 1`
      };

      const results = {};
      for (const [key, sql] of Object.entries(queries)) {
        const params = key === 'lastTransaction' ? [accountId, accountId] : [accountId];
        const [rows] = await pool.query(sql, params);
        results[key] = rows[0]?.balance || rows[0]?.total || rows[0]?.created_at || 0;
      }

      return results;
    } catch (err) {
      console.error('Error in getStatsByAccountId:', err);
      throw err;
    }
  }
}

export default new AccountRepository();
