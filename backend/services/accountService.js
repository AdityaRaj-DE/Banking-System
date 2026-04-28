import accountRepository from '../repositories/accountRepository.js';
import customerRepository from '../repositories/customerRepository.js';

class AccountService {
  async createAccount(accountData) {
    const { customer_id } = accountData;
    const customer = await customerRepository.findById(customer_id);
    if (!customer) {
      const error = new Error('Customer not found');
      error.status = 404;
      throw error;
    }

    const accountId = await accountRepository.create(accountData);
    return await accountRepository.findById(accountId);
  }

  async getAccountById(id) {
    const account = await accountRepository.findById(id);
    if (!account) {
      const error = new Error('Account not found');
      error.status = 404;
      throw error;
    }
    return account;
  }

  async getAccountsByCustomerId(customerId) {
    const customer = await customerRepository.findById(customerId);
    if (!customer) {
      const error = new Error('Customer not found');
      error.status = 404;
      throw error;
    }
    return await accountRepository.findByCustomerId(customerId);
  }

  async updateAccountStatus(id, status) {
    const updated = await accountRepository.updateStatus(id, status);
    if (!updated) {
      const error = new Error('Account not found');
      error.status = 404;
      throw error;
    }
    return await accountRepository.findById(id);
  }
}

export default new AccountService();
