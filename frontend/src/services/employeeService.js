import api from './api';

const employeeService = {
  getEmployees: () => api.get('/employees'),
  getEmployeeById: (id) => api.get(`/employees/${id}`),
  getEmployeesByBranch: (branchId) => api.get(`/employees/branch/${branchId}`),
  createEmployee: (data) => api.post('/employees', data),
  deleteEmployee: (id) => api.delete(`/employees/${id}`),
  
  getBranches: () => api.get('/branches'),
  getBranchById: (id) => api.get(`/branches/${id}`),
  createBranch: (data) => api.post('/branches', data),
  deleteBranch: (id) => api.delete(`/branches/${id}`),
};

export default employeeService;
