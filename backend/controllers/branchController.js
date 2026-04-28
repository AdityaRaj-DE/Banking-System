import branchService from '../services/branchService.js';
import { successResponse } from '../utils/response.js';

class BranchController {
  async create(req, res, next) {
    try {
      const data = await branchService.createBranch(req.body);
      successResponse(res, data, 'Branch created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const data = await branchService.getAllBranches();
      successResponse(res, data);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await branchService.getBranchById(req.params.id);
      successResponse(res, data);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await branchService.deleteBranch(req.params.id);
      successResponse(res, null, 'Branch deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

export default new BranchController();
