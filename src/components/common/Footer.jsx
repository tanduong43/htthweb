import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../../context/ConfigContext';
import { SUPPORT_LINKS } from '../../utils/constants';

export default function Footer() {
  const navigate = useNavigate();
  const { rechargeEnabled } = useConfig();

  return (
    <footer className="site-footer">
      <div className="footer-glow-bar"></div>
      
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="footer-brand-header">
              <span className="footer-anchor">⚓</span>
              <div>
                <h3 className="footer-brand-title">THẾ GIỚI HẢI TẶC</h3>
                <span className="footer-brand-sub">ĐẠI CHIẾN TỨ HOÀNG</span>
              </div>
            </div>
            <p className="footer-desc">
              Trải nghiệm máy chủ Hải Tặc Private chất lượng cao, đồ họa sắc nét, lối chơi nhập vai kinh điển chuẩn nguyên tác Anime One Piece. Chinh phục Đại Hải Trình ngay hôm nay!
            </p>
          </div>

          {/* Navigation Links */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">ĐIỀU HƯỚNG</h4>
            <ul className="footer-nav-list">
              <li>
                <a href="/" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  Trang Chủ
                </a>
              </li>
              <li>
                <a href="#download" onClick={(e) => { e.preventDefault(); document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  Tải Game
                </a>
              </li>
              {rechargeEnabled && (
                <li>
                  <a href="/nap-tien" onClick={(e) => { e.preventDefault(); navigate('/nap-tien'); }}>
                    Nạp Tiền Tự Động
                  </a>
                </li>
              )}
              <li>
                <a href="/tai-khoan" onClick={(e) => { e.preventDefault(); navigate('/tai-khoan'); }}>
                  Quản Lý Tài Khoản
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="footer-support-col">
            <h4 className="footer-col-title">HỖ TRỢ THUYỀN TRƯỞNG</h4>
            <p className="footer-support-text">
              Đội ngũ BQT túc trực 24/7. Hỗ trợ giải đáp thắc mắc, nạp thẻ và xử lý sự cố trong game nhanh chóng.
            </p>
            <div className="footer-channels">
              <a
                href={SUPPORT_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="channel-badge telegram-badge"
              >
                <span className="channel-icon">💬</span>
                <div className="channel-info">
                  <span className="channel-label">Telegram Hỗ Trợ</span>
                  <span className="channel-handle">{SUPPORT_LINKS.telegramName}</span>
                </div>
              </a>

              <a
                href={SUPPORT_LINKS.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="channel-badge zalo-badge"
              >
                <span className="channel-icon">👥</span>
                <div className="channel-info">
                  <span className="channel-label">Cộng Đồng Zalo</span>
                  <span className="channel-handle">{SUPPORT_LINKS.zaloName}</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            © 2026 Thế Giới Hải Tặc Private Server. Mọi quyền được bảo lưu.
          </p>
          <div className="health-warning-pill">
            <span className="warning-icon">⚠️</span>
            <span>Chơi game quá 180 phút mỗi ngày có thể ảnh hưởng đến sức khỏe!</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
