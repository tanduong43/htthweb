import React from 'react';
import { motion } from 'framer-motion';
import { DOWNLOAD_LINKS } from '../../utils/constants';

export default function DownloadSection() {
  return (
    <section id="download" className="download-section container-section">
      <div className="download-banner-card">
        <div className="banner-backdrop-glow"></div>
        <div className="banner-corner-decor tl"></div>
        <div className="banner-corner-decor tr"></div>
        <div className="banner-corner-decor bl"></div>
        <div className="banner-corner-decor br"></div>

        <div className="download-header-text">
          <span className="download-badge">ĐA NỀN TẢNG</span>
          <h2 className="download-main-title">TẢI GAME MIỄN PHÍ</h2>
          <p className="download-lead">
            Hỗ trợ trải nghiệm tối ưu trên mọi thiết bị. Luyện cấp và tham gia chiến trường nảy lửa trên PC, linh hoạt PK mọi lúc mọi nơi trên điện thoại di động Android và iOS!
          </p>
        </div>

        <div className="download-cards-grid">
          {/* Android */}
          <motion.a
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={DOWNLOAD_LINKS.android}
            target="_blank"
            rel="noopener noreferrer"
            className="download-platform-card android-card"
          >
            <div className="platform-icon-wrap">
              <span className="os-icon">📱</span>
            </div>
            <div className="platform-details">
              <span className="os-title">Android (APK)</span>
              <span className="os-sub">Cài đặt trực tiếp qua Google Drive</span>
            </div>
            <div className="download-arrow-icon">
              <span>⬇</span>
            </div>
          </motion.a>

          {/* iOS */}
          <motion.a
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={DOWNLOAD_LINKS.ios}
            target="_blank"
            rel="noopener noreferrer"
            className="download-platform-card ios-card"
          >
            <div className="platform-icon-wrap">
              <span className="os-icon">🍎</span>
            </div>
            <div className="platform-details">
              <span className="os-title">iOS (iPhone / iPad)</span>
              <span className="os-sub">Hướng dẫn cài qua TestFlight / Web</span>
            </div>
            <div className="download-arrow-icon">
              <span>⬇</span>
            </div>
          </motion.a>

          {/* PC Windows */}
          <motion.a
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={DOWNLOAD_LINKS.pc}
            target="_blank"
            rel="noopener noreferrer"
            className="download-platform-card pc-card"
          >
            <div className="platform-icon-wrap">
              <span className="os-icon">💻</span>
            </div>
            <div className="platform-details">
              <span className="os-title">PC (Windows)</span>
              <span className="os-sub">Bản cài đặt Client tối ưu 60 FPS</span>
            </div>
            <div className="download-arrow-icon">
              <span>⬇</span>
            </div>
          </motion.a>
        </div>

        <div className="download-footer-note">
          <span className="note-icon">💡</span>
          <span>Bản cài đặt an toàn, không chứa phần mềm độc hại. Yêu cầu bộ nhớ trống tối thiểu 500MB.</span>
        </div>
      </div>
    </section>
  );
}
