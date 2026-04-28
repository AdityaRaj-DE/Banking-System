import transactionRepository from '../repositories/transactionRepository.js';
import accountRepository from '../repositories/accountRepository.js';
import pool from '../config/db.js';

class TransactionService {
  async deposit(accountId, amount) {
    if (amount <= 0) {
      const error = new Error('Amount must be greater than zero');
      error.status = 400;
      throw error;
    }

    const account = await accountRepository.findById(accountId);
    if (!account) {
      const error = new Error('Account not found');
      error.status = 404;
      throw error;
    }

    if (account.status !== 'active') {
      const error = new Error('Account is not active');
      error.status = 400;
      throw error;
    }

    await transactionRepository.deposit(accountId, amount);
    return { message: 'Deposit successful' };
  }

  async withdraw(accountId, amount) {
    if (amount <= 0) {
      const error = new Error('Amount must be greater than zero');
      error.status = 400;
      throw error;
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Lock the row for update to prevent race conditions
      const [rows] = await connection.query('SELECT balance, status FROM accounts WHERE account_id = ? FOR UPDATE', [accountId]);
      const account = rows[0];

      if (!account) {
        const error = new Error('Account not found');
        error.status = 404;
        throw error;
      }

      if (account.status !== 'active') {
        const error = new Error('Account is not active');
        error.status = 400;
        throw error;
      }

      if (account.balance < amount) {
        const error = new Error('Insufficient balance');
        error.status = 400;
        throw error;
      }

      await accountRepository.updateBalance(accountId, -amount, connection);
      await transactionRepository.createTransaction({
        from_account: accountId,
        to_account: null,
        amount,
        transaction_type: 'withdraw',
        status: 'completed'
      }, connection);

      await connection.commit();
      return { message: 'Withdrawal successful' };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async transfer(fromAccountId, toAccountId, amount) {
    if (amount <= 0) {
      const error = new Error('Amount must be greater than zero');
      error.status = 400;
      throw error;
    }

    if (fromAccountId === toAccountId) {
      const error = new Error('Cannot transfer to the same account');
      error.status = 400;
      throw error;
    }

    const fromAccount = await accountRepository.findById(fromAccountId);
    const toAccount = await accountRepository.findById(toAccountId);

    if (!fromAccount || !toAccount) {
      const error = new Error('One or both accounts not found');
      error.status = 404;
      throw error;
    }

    if (fromAccount.status !== 'active' || toAccount.status !== 'active') {
      const error = new Error('One or both accounts are not active');
      error.status = 400;
      throw error;
    }

    if (fromAccount.balance < amount) {
      const error = new Error('Insufficient balance');
      error.status = 400;
      throw error;
    }

    // Call stored procedure which handles transaction logic
    await transactionRepository.transfer(fromAccountId, toAccountId, amount);
    return { message: 'Transfer successful' };
  }

  async getTransactionHistory(accountId) {
    if (!accountId) {
      const error = new Error('Account ID is required');
      error.status = 400;
      throw error;
    }
    const account = await accountRepository.findById(accountId);
    if (!account) {
      const error = new Error('Account not found');
      error.status = 404;
      throw error;
    }
    return await transactionRepository.findByAccountId(accountId);
  }

  async getTransactionById(id) {
    const transaction = await transactionRepository.findById(id);
    if (!transaction) {
      const error = new Error('Transaction not found');
      error.status = 404;
      throw error;
    }
    return transaction;
  }
}

export default new TransactionService();
