import api from './api';

export const bankingService = {
  getBankConfig: () => api.get('recharge/bank_config'),
  getHistory: () => api.get('banking/history'),
  getActiveDeposit: () => api.get('banking/active'),
  createDeposit: (amount) => api.post('banking/deposit', { amount }),
  cancelDeposit: (code) => api.post('banking/cancel', { code }),
  confirmPayment: (code) => api.post('banking/confirm_payment', { code }),
};

export default bankingService;
