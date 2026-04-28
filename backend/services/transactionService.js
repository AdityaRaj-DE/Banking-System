import transactionRepository from '../repositories/transactionRepository.js';
import accountRepository from '../repositories/accountRepository.js';
import pool from '../config/db.js';

class TransactionService {
  async deposit(accountId, amount) {
    if (isNaN(amount) || amount <= 0) {
      const error = new Error('Amount must be a valid number greater than zero');
      error.status = 400;
      throw error;
    }

    // The procedure handles status checks and locking
    await transactionRepository.deposit(accountId, amount);
    return { message: 'Deposit successful' };
  }

  async withdraw(accountId, amount) {
    if (isNaN(amount) || amount <= 0) {
      const error = new Error('Amount must be a valid number greater than zero');
      error.status = 400;
      throw error;
    }

    // The procedure handles locking, status, and balance checks
    await transactionRepository.withdraw(accountId, amount);
    return { message: 'Withdrawal successful' };
  }

  async transfer(fromAccountId, toAccountId, amount) {
    if (isNaN(amount) || amount <= 0) {
      const error = new Error('Amount must be a valid number greater than zero');
      error.status = 400;
      throw error;
    }

    if (fromAccountId === toAccountId) {
      const error = new Error('Cannot transfer to the same account');
      error.status = 400;
      throw error;
    }

    // The procedure handles locking, status, and balance checks for both accounts
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
