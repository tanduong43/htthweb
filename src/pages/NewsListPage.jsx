import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import newsService from '../services/newsService';
import { formatDate, getTag } from '../utils/formatters';
import SectionHeading from '../components/common/SectionHeading';

export default function NewsListPage() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    document.title = 'Tin Tức & Sự Kiện | Thế Giới Hải Tặc - Đại Chiến Tứ Hoàng';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Cập nhật liên tục các tin tức nóng hổi, sự kiện khuyến mãi, và thông tin bảo trì máy chủ mới nhất của game Thế Giới Hải Tặc.'
      );
    }
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await newsService.getNews({
          page,
          limit: 6,
          search: searchQuery,
        });
        if (response.data && response.data.success) {
          setNews(response.data.data || []);
          setPagination(
            response.data.pagination || {
              page,
              limit: 6,
              total: 0,
              totalPages: 1,
            }
          );
        } else {
          setError('Không thể lấy danh sách tin tức.');
        }
      } catch (err) {
        console.error('Fetch news list error:', err);
        setError('Lỗi kết nối máy chủ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [page, searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="news-page-view">
      <div className="page-standard-container">
        {/* Header */}
        <SectionHeading
          tag="BẢN TIN HẢI TẶC"
          title="TIN TỨC & SỰ KIỆN CHÍNH THỨC"
          subtitle="Nơi cập nhật thông báo bảo trì, giải đấu PK và sự kiện ưu đãi từ Ban Quản Trị."
        />

        {/* Search & Filter Bar */}
        <div className="news-search-toolbar">
          <form onSubmit={handleSearchSubmit} className="search-form-wrap">
            <span className="search-symbol">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm bài viết, sự kiện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-field"
            />
            <button type="submit" className="search-submit-btn">
              Tìm Kiếm
            </button>
          </form>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="game-page-loading">
            <div className="anchor-spinner">⚓</div>
            <p>Đang lật mở các cuộn thư tịch hải tặc...</p>
          </div>
        ) : error ? (
          <div className="news-error-panel">
            <span className="error-icon">⚠️</span>
            <h3>Có lỗi xảy ra</h3>
            <p>{error}</p>
            <button onClick={() => setSearchQuery('')} className="btn-retry-action">
              Tải lại
            </button>
          </div>
        ) : news.length === 0 ? (
          <div className="news-empty-panel">
            <span className="empty-icon">📜</span>
            <h3>Chưa tìm thấy bài viết nào</h3>
            <p>Không có tin tức nào phù hợp với từ khóa của bạn.</p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSearchQuery('');
                  setPage(1);
                }}
                className="btn-clear-search-action"
              >
                Xóa bộ lọc tìm kiếm
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="news-items-grid">
              {news.map((item, idx) => {
                const tag = getTag(item.title);
                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    whileHover={{ y: -6 }}
                    className="news-grid-card"
                    onClick={() => navigate(`/news/${item.slug || item.id}`)}
                  >
                    {item.thumbnail && (
                      <div className="news-thumbnail-frame">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="news-thumbnail-img"
                        />
                      </div>
                    )}
                    <div className="news-card-inner">
                      <div className="news-meta-row">
                        <span className={`news-tag-badge tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                          {tag}
                        </span>
                        <span className="news-date-text">
                          📅 {formatDate(item.published_at || item.created_at)}
                        </span>
                      </div>
                      <h3 className="news-title-text">{item.title}</h3>
                      <p className="news-summary-text">{item.summary}</p>
                      <div className="news-card-action">
                        <span className="read-more-link">
                          Xem chi tiết <span className="arrow">›</span>
                        </span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {/* Pagination Dock */}
            {pagination.totalPages > 1 && (
              <div className="news-pagination-dock">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="pag-btn prev"
                >
                  ‹ Trang trước
                </button>

                <div className="pag-numbers-group">
                  {Array.from({ length: pagination.totalPages }, (_, idx) => idx + 1).map((pNum) => (
                    <button
                      key={pNum}
                      onClick={() => handlePageChange(pNum)}
                      className={`pag-num-btn ${page === pNum ? 'active' : ''}`}
                    >
                      {pNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.totalPages}
                  className="pag-btn next"
                >
                  Trang sau ›
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
