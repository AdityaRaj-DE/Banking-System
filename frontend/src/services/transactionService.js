import api from './api';

const transactionService = {
  deposit: (accountId, amount) => api.post(`/accounts/${accountId}/deposit`, { amount }),
  withdraw: (accountId, amount) => api.post(`/accounts/${accountId}/withdraw`, { amount }),
  transfer: (data) => api.post('/transactions/transfer', data),
  getHistory: (accountId) => api.get(`/transactions/account/${accountId}`),
  getTransactionById: (id) => api.get(`/transactions/${id}`),
};

export default transactionService;
