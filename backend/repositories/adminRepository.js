import pool from '../config/db.js';

class AdminRepository {
  async getAuditLogs() {
    const [rows] = await pool.query('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 200');
    return rows;
  }

  async analyzeQuery(query) {
    // Basic query analysis using EXPLAIN
    const [rows] = await pool.query(`EXPLAIN ${query}`);
    return rows;
  }

  async getAnalyticsData() {
    const queries = {
      summary: `
        SELECT 
          (SELECT COUNT(*) FROM customers) as total_customers,
          (SELECT COUNT(*) FROM accounts) as total_accounts,
          (SELECT SUM(balance) FROM accounts) as total_balance,
          (SELECT COUNT(*) FROM transactions) as total_transactions,
          (SELECT SUM(amount) FROM transactions WHERE status = 'completed') as total_volume
      `,
      transactionsByType: `
        SELECT transaction_type, COUNT(*) as count, SUM(amount) as total_amount 
        FROM transactions 
        WHERE status = 'completed'
        GROUP BY transaction_type
      `,
      accountsByType: `
        SELECT account_type, COUNT(*) as count, SUM(balance) as total_balance
        FROM accounts
        GROUP BY account_type
      `,
      accountsByStatus: `
        SELECT status, COUNT(*) as count
        FROM accounts
        GROUP BY status
      `,
      transactionsTimeline: `
        SELECT DATE(created_at) as date, COUNT(*) as count, SUM(amount) as amount
        FROM transactions
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date
      `
    };

    const results = {};
    for (const [key, sql] of Object.entries(queries)) {
      const [rows] = await pool.query(sql);
      results[key] = rows;
    }

    return results;
  }
}

export default new AdminRepository();
