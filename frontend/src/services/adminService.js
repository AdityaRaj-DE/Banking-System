import api from './api';

const adminService = {
  getAuditLogs: () => api.get('/admin/audit-logs'),
  analyzeQuery: (query) => api.get(`/admin/query-analysis?query=${encodeURIComponent(query)}`),
  backup: () => api.post('/admin/backup'),
  restore: () => api.post('/admin/restore'),
  getAnalytics: () => api.get('/admin/analytics'),
};

export default adminService;
