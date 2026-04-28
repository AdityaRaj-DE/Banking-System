import customerRepository from '../repositories/customerRepository.js';
import accountRepository from '../repositories/accountRepository.js';

class CustomerService {
  async getAllCustomers() {
    return await customerRepository.findAll();
  }

  async getCustomerById(id) {
    const customer = await customerRepository.findById(id);
    if (!customer) {
      const error = new Error('Customer not found');
      error.status = 404;
      throw error;
    }
    return customer;
  }

  async updateCustomer(id, customerData) {
    const updated = await customerRepository.update(id, customerData);
    if (!updated) {
      const error = new Error('Customer not found or no changes made');
      error.status = 404;
      throw error;
    }
    return await customerRepository.findById(id);
  }

  async deleteCustomer(id) {
    const deleted = await customerRepository.delete(id);
    if (!deleted) {
      const error = new Error('Customer not found');
      error.status = 404;
      throw error;
    }
    return true;
  }

  async getCustomerAccounts(id) {
    const customer = await customerRepository.findById(id);
    if (!customer) {
      const error = new Error('Customer not found');
      error.status = 404;
      throw error;
    }
    return await accountRepository.findByCustomerId(id);
  }
}

export default new CustomerService();
