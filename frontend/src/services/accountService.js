import api from './api';

const accountService = {
  createAccount: (data) => api.post('/accounts', data),
  getAccounts: () => api.get('/accounts/customer/me'), // Use current user context
  // Wait, the backend has GET /api/v1/accounts/customer/:id
  // I should check if there's a helper for "me" or if I should just use the user ID from context.
  // Actually, I'll just use the customer ID from the auth user object.
  getAccountsByCustomerId: (id) => api.get(`/accounts/customer/${id}`),
  getAccountById: (id) => api.get(`/accounts/${id}`),
  updateStatus: (id, status) => api.patch(`/accounts/${id}/status`, { status }),
};

export default accountService;
