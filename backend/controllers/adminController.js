import adminService from '../services/adminService.js';
import { successResponse } from '../utils/response.js';

class AdminController {
  async getAuditLogs(req, res, next) {
    try {
      const data = await adminService.getAuditLogs();
      successResponse(res, data);
    } catch (err) {
      next(err);
    }
  }

  async analyzeQuery(req, res, next) {
    try {
      const { query } = req.query;
      const data = await adminService.analyzeQuery(query);
      successResponse(res, data);
    } catch (err) {
      next(err);
    }
  }

  async backup(req, res, next) {
    try {
      const data = await adminService.backupDatabase();
      successResponse(res, data);
    } catch (err) {
      next(err);
    }
  }

  async restore(req, res, next) {
    try {
      const data = await adminService.restoreDatabase();
      successResponse(res, data);
    } catch (err) {
      next(err);
    }
  }
}

export default new AdminController();
