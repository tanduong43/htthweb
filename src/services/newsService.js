import api from './api';

export const newsService = {
  getNews: (params = { page: 1, limit: 6, search: '' }) => api.get('news', { params }),
  getNewsDetail: (idOrSlug) => api.get(`news/${idOrSlug}`),
};

export default newsService;
