import customerService from '../services/customerService.js';
import { successResponse } from '../utils/response.js';

class CustomerController {
  async getAll(req, res, next) {
    try {
      const data = await customerService.getAllCustomers();
      successResponse(res, data);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await customerService.getCustomerById(req.params.id);
      successResponse(res, data);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const data = await customerService.updateCustomer(req.params.id, req.body);
      successResponse(res, data, 'Customer updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await customerService.deleteCustomer(req.params.id);
      successResponse(res, null, 'Customer deleted successfully');
    } catch (err) {
      next(err);
    }
  }

  async getAccounts(req, res, next) {
    try {
      const data = await customerService.getCustomerAccounts(req.params.id);
      successResponse(res, data);
    } catch (err) {
      next(err);
    }
  }
}

export default new CustomerController();
