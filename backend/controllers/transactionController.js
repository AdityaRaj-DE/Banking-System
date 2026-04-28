import transactionService from '../services/transactionService.js';
import { successResponse } from '../utils/response.js';

class TransactionController {
  async deposit(req, res, next) {
    try {
      const { amount } = req.body;
      const data = await transactionService.deposit(req.params.id, amount);
      successResponse(res, data, 'Deposit successful');
    } catch (err) {
      next(err);
    }
  }

  async withdraw(req, res, next) {
    try {
      const { amount } = req.body;
      const data = await transactionService.withdraw(req.params.id, amount);
      successResponse(res, data, 'Withdrawal successful');
    } catch (err) {
      next(err);
    }
  }

  async transfer(req, res, next) {
    try {
      const { from_account, to_account, amount } = req.body;
      const data = await transactionService.transfer(from_account, to_account, amount);
      successResponse(res, data, 'Transfer successful');
    } catch (err) {
      next(err);
    }
  }

  async getHistory(req, res, next) {
    try {
      const data = await transactionService.getTransactionHistory(req.params.account_id);
      successResponse(res, data);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await transactionService.getTransactionById(req.params.id);
      successResponse(res, data);
    } catch (err) {
      next(err);
    }
  }
}

export default new TransactionController();
