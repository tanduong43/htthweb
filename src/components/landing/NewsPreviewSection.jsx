import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDate, getTag } from '../../utils/formatters';
import SectionHeading from '../common/SectionHeading';

export default function NewsPreviewSection({ news = [] }) {
  const navigate = useNavigate();

  return (
    <section className="news-preview-section container-section">
      <div className="section-head-with-action">
        <SectionHeading
          tag="BẢN TIN HẢI TẶC"
          title="TIN TỨC & SỰ KIỆN NỔI BẬT"
          subtitle="Cập nhật nhanh các sự kiện mở server, khuyến mại nạp và lịch bảo trì mới nhất."
        />
        <div className="view-all-news-wrap">
          <button
            onClick={() => navigate('/news')}
            className="btn-view-all-news"
          >
            <span>XEM TẤT CẢ BÀI VIẾT</span> <span>→</span>
          </button>
        </div>
      </div>

      <div className="news-cards-grid">
        {news.slice(0, 3).map((item, idx) => {
          const tag = getTag(item.title);
          const dateStr = item.published_at ? formatDate(item.published_at) : (item.date || '');
          const summaryStr = item.summary || item.desc || '';
          const targetUrl = item.slug || item.id ? `/news/${item.slug || item.id}` : '/tai-khoan';

          return (
            <motion.article
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="news-chronicle-card"
              onClick={() => navigate(targetUrl)}
            >
              <div className="card-ambient-light"></div>
              
              <div className="news-meta-bar">
                <span className={`news-tag-badge tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                  {tag}
                </span>
                <span className="news-date-text">📅 {dateStr}</span>
              </div>

              <h3 className="news-article-title">{item.title}</h3>
              <p className="news-article-summary">{summaryStr}</p>

              <div className="news-card-footer">
                <span className="btn-readmore-link">
                  Đọc toàn văn bài viết <span className="arrow-sym">›</span>
                </span>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
