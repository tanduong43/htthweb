import api from './api';

export const authService = {
  login: (username, password) => api.post('login/', { username, password }),
  register: (username, password, captchaToken, captchaAnswer) =>
    api.post('register/', { username, password, captchaToken, captchaAnswer }),
  getCaptcha: () => api.get('captcha/'),
  getMe: () => api.get('me/'),
  logout: () => api.post('logout/'),
  activate: () => api.post('activate/'),
  changePassword: (oldPassword, newPassword) => api.post('change-password', { oldPassword, newPassword }),
};

export default authService;
