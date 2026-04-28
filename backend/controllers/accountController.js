import accountService from '../services/accountService.js';
import { successResponse } from '../utils/response.js';

class AccountController {
  async create(req, res, next) {
    try {
      const data = await accountService.createAccount(req.body);
      successResponse(res, data, 'Account created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await accountService.getAccountById(req.params.id);
      successResponse(res, data);
    } catch (err) {
      next(err);
    }
  }

  async getByCustomerId(req, res, next) {
    try {
      const data = await accountService.getAccountsByCustomerId(req.params.id);
      successResponse(res, data);
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const data = await accountService.updateAccountStatus(req.params.id, status);
      successResponse(res, data, `Account status updated to ${status}`);
    } catch (err) {
      next(err);
    }
  }
}

export default new AccountController();
