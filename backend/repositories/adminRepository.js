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
}

export default new AdminRepository();
