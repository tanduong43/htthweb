import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import newsService from '../services/newsService';
import { formatDate, getTag } from '../utils/formatters';

export default function NewsDetailPage() {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await newsService.getNewsDetail(idOrSlug);
        if (response.data && response.data.success) {
          const data = response.data.data;
          setArticle(data);

          document.title = `${data.title} | Thế Giới Hải Tặc`;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute('content', data.summary || '');
          }

          // Fetch related articles
          try {
            const relResponse = await newsService.getNews({ page: 1, limit: 4 });
            if (relResponse.data && relResponse.data.success) {
              const otherArticles = (relResponse.data.data || [])
                .filter((item) => item.id !== data.id)
                .slice(0, 3);
              setRelated(otherArticles);
            }
          } catch (err) {
            console.error('Error fetching related news:', err);
          }
        } else {
          setError('Không thể tìm thấy bài viết.');
        }
      } catch (err) {
        console.error('Fetch article error:', err);
        if (err.response && err.response.status === 404) {
          setError('Bài viết này không tồn tại hoặc đã bị xóa.');
        } else {
          setError('Lỗi kết nối máy chủ. Vui lòng thử lại sau.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetail();
  }, [idOrSlug]);

  return (
    <div className="news-detail-page-view">
      <div className="page-standard-container">
        {/* Back navigation */}
        <div className="detail-top-nav">
          <button onClick={() => navigate('/news')} className="btn-back-chronicle">
            ← Quay Lại Bản Tin Hải Tặc
          </button>
        </div>

        {loading ? (
          <div className="game-page-loading">
            <div className="anchor-spinner">⚓</div>
            <p>Đang trải cuộn giấy ghi chép bài viết...</p>
          </div>
        ) : error ? (
          <div className="news-error-panel">
            <span className="error-icon">⚠️</span>
            <h3>Có lỗi xảy ra</h3>
            <p>{error}</p>
            <button onClick={() => navigate('/news')} className="btn-retry-action">
              Xem các bài viết khác
            </button>
          </div>
        ) : article ? (
          <article className="chronicle-detail-panel">
            <header className="chronicle-header">
              <div className="chronicle-meta-row">
                <span className={`news-tag-badge tag-${getTag(article.title).toLowerCase().replace(/\s+/g, '-')}`}>
                  {getTag(article.title)}
                </span>
                <span className="chronicle-date">
                  📅 Đăng ngày: {formatDate(article.published_at || article.created_at)}
                </span>
              </div>
              <h1 className="chronicle-title">{article.title}</h1>
            </header>

            {article.thumbnail && (
              <div className="chronicle-featured-image">
                <img src={article.thumbnail} alt={article.title} />
              </div>
            )}

            <div
              className="chronicle-body-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>
        ) : null}

        {/* Related News Section */}
        {!loading && !error && related.length > 0 && (
          <section className="related-articles-section">
            <h3 className="related-section-title">
              <span>⚓ TIN TỨC LIÊN QUAN</span>
            </h3>
            <div className="news-items-grid">
              {related.map((item) => {
                const tag = getTag(item.title);
                return (
                  <motion.article
                    key={item.id}
                    whileHover={{ y: -6 }}
                    className="news-grid-card"
                    onClick={() => navigate(`/news/${item.slug || item.id}`)}
                  >
                    <div className="news-card-inner">
                      <div className="news-meta-row">
                        <span className={`news-tag-badge tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                          {tag}
                        </span>
                        <span className="news-date-text">
                          📅 {formatDate(item.published_at || item.created_at)}
                        </span>
                      </div>
                      <h4 className="news-title-text">{item.title}</h4>
                      <p className="news-summary-text">{item.summary}</p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
