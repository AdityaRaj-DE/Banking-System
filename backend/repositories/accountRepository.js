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
}

export default new AccountRepository();
