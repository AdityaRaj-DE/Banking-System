import branchRepository from '../repositories/branchRepository.js';

class BranchService {
  async createBranch(branchData) {
    const branchId = await branchRepository.create(branchData);
    return await branchRepository.findById(branchId);
  }

  async getAllBranches() {
    return await branchRepository.findAll();
  }

  async getBranchById(id) {
    const branch = await branchRepository.findById(id);
    if (!branch) {
      const error = new Error('Branch not found');
      error.status = 404;
      throw error;
    }
    return branch;
  }

  async deleteBranch(id) {
    const deleted = await branchRepository.delete(id);
    if (!deleted) {
      const error = new Error('Branch not found');
      error.status = 404;
      throw error;
    }
    return true;
  }
}

export default new BranchService();
