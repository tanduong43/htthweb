import React, { useState, useEffect } from 'react';
import HeroSlider from '../components/landing/HeroSlider';
import ClassShowcase from '../components/landing/ClassShowcase';
import LeaderboardSection from '../components/landing/LeaderboardSection';
import NewsPreviewSection from '../components/landing/NewsPreviewSection';
import DownloadSection from '../components/landing/DownloadSection';
import rankingService from '../services/rankingService';
import newsService from '../services/newsService';

export default function HomePage() {
  const [rankings, setRankings] = useState({ topLevel: [], topPvp: [], topClan: [] });
  const [loadingRank, setLoadingRank] = useState(true);
  const [errorRank, setErrorRank] = useState(null);
  const [news, setNews] = useState([]);

  const fetchRankings = async () => {
    setLoadingRank(true);
    setErrorRank(null);
    try {
      const res = await rankingService.getRankings();
      if (res.data && res.data.success) {
        setRankings({
          topLevel: res.data.topLevel || [],
          topPvp: res.data.topPvp || [],
          topClan: res.data.topClan || [],
        });
      } else {
        setErrorRank(res.data?.message || 'Không thể tải dữ liệu bảng xếp hạng.');
      }
    } catch (err) {
      console.error('Error loading rankings:', err);
      setErrorRank('Không thể kết nối tới máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoadingRank(false);
    }
  };

  const fetchNews = async () => {
    try {
      const res = await newsService.getNews({ page: 1, limit: 3 });
      if (res.data && res.data.success && res.data.data) {
        setNews(res.data.data);
      }
    } catch (err) {
      console.error('Error loading news:', err);
    }
  };

  useEffect(() => {
    fetchRankings();
    fetchNews();
  }, []);

  return (
    <div className="home-page-view">
      <HeroSlider />
      <ClassShowcase />
      <LeaderboardSection
        rankings={rankings}
        loading={loadingRank}
        error={errorRank}
        onRetry={fetchRankings}
      />
      <NewsPreviewSection news={news} />
      <DownloadSection />
    </div>
  );
}
