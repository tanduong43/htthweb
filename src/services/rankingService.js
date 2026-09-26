import api from './api';

export const rankingService = {
  getRankings: () => api.get('ranking'),
};

export default rankingService;
