import employeeRepository from '../repositories/employeeRepository.js';
import branchRepository from '../repositories/branchRepository.js';

class EmployeeService {
  async createEmployee(employeeData) {
    const { branch_id } = employeeData;
    if (branch_id) {
      const branch = await branchRepository.findById(branch_id);
      if (!branch) {
        const error = new Error('Branch not found');
        error.status = 404;
        throw error;
      }
    }

    const employeeId = await employeeRepository.create(employeeData);
    return await employeeRepository.findById(employeeId);
  }

  async getAllEmployees() {
    return await employeeRepository.findAll();
  }

  async getEmployeeById(id) {
    const employee = await employeeRepository.findById(id);
    if (!employee) {
      const error = new Error('Employee not found');
      error.status = 404;
      throw error;
    }
    return employee;
  }

  async getEmployeesByBranchId(branchId) {
    const branch = await branchRepository.findById(branchId);
    if (!branch) {
      const error = new Error('Branch not found');
      error.status = 404;
      throw error;
    }
    return await employeeRepository.findByBranchId(branchId);
  }

  async deleteEmployee(id) {
    const deleted = await employeeRepository.delete(id);
    if (!deleted) {
      const error = new Error('Employee not found');
      error.status = 404;
      throw error;
    }
    return true;
  }
}

export default new EmployeeService();
