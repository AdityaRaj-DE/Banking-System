import pool from '../config/db.js';

class TransactionRepository {
  async deposit(accountId, amount) {
    const [result] = await pool.query('CALL DepositMoney(?, ?)', [accountId, amount]);
    return result;
  }

  async transfer(fromAccountId, toAccountId, amount) {
    const [result] = await pool.query('CALL TransferMoney(?, ?, ?)', [fromAccountId, toAccountId, amount]);
    return result;
  }

  async withdraw(accountId, amount) {
    const [result] = await pool.query('CALL WithdrawMoney(?, ?)', [accountId, amount]);
    return result;
  }

  async findByAccountId(accountId) {
    const [rows] = await pool.query(
      'SELECT * FROM transactions WHERE from_account = ? OR to_account = ? ORDER BY created_at DESC',
      [accountId, accountId]
    );
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM transactions WHERE transaction_id = ?', [id]);
    return rows[0];
  }

  // For manual transaction handling (like withdrawal if not using a procedure)
  async createTransaction(transactionData, connection = pool) {
    const { from_account, to_account, amount, transaction_type, status } = transactionData;
    const [result] = await connection.query(
      'INSERT INTO transactions (from_account, to_account, amount, transaction_type, status) VALUES (?, ?, ?, ?, ?)',
      [from_account, to_account, amount, transaction_type, status || 'completed']
    );
    return result.insertId;
  }
}

export default new TransactionRepository();
