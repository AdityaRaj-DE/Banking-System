import employeeService from '../services/employeeService.js';
import { successResponse } from '../utils/response.js';

class EmployeeController {
  async create(req, res, next) {
    try {
      const data = await employeeService.createEmployee(req.body);
      successResponse(res, data, 'Employee created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const data = await employeeService.getAllEmployees();
      successResponse(res, data);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await employeeService.getEmployeeById(req.params.id);
      successResponse(res, data);
    } catch (err) {
      next(err);
    }
  }

  async getByBranchId(req, res, next) {
    try {
      const data = await employeeService.getEmployeesByBranchId(req.params.branch_id);
      successResponse(res, data);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await employeeService.deleteEmployee(req.params.id);
      successResponse(res, null, 'Employee deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

export default new EmployeeController();
