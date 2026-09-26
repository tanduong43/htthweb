import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import useScrollPosition from '../../hooks/useScrollPosition';

export default function Navbar() {
  const { user } = useAuth();
  const { rechargeEnabled } = useConfig();
  const location = useLocation();
  const navigate = useNavigate();
  const { isScrolled } = useScrollPosition(30);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hash = location.hash;

  // Active route checks
  const isHomeActive = location.pathname === '/' && hash !== '#download';
  const isDownloadActive = location.pathname === '/' && hash === '#download';
  const isNewsActive = location.pathname.startsWith('/news');
  const isTopupActive = location.pathname === '/nap-tien';
  const isAccountActive = ['/tai-khoan', '/login', '/register'].includes(location.pathname);

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  const handleHomeClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/', { replace: true });
    }
  };

  const handleDownloadClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/#download');
    } else {
      const element = document.getElementById('download');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      navigate('/#download', { replace: true });
    }
  };

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-inner">
        {/* Brand / Logo */}
        <div
          className="brand-logo"
          onClick={() => {
            setIsMobileMenuOpen(false);
            if (location.pathname !== '/') navigate('/');
            else window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          role="button"
          tabIndex={0}
        >
          <div className="logo-emblem">
            <span className="anchor-icon">⚓</span>
            <div className="emblem-halo"></div>
          </div>
          <div className="brand-text">
            <span className="brand-title">THẾ GIỚI HẢI TẶC</span>
            <span className="brand-sub">ĐẠI CHIẾN TỨ HOÀNG</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <a
            href="/"
            onClick={handleHomeClick}
            className={`nav-link-item ${isHomeActive ? 'active' : ''}`}
          >
            <span>Trang Chủ</span>
            {isHomeActive && <motion.div layoutId="navIndicator" className="nav-active-bar" />}
          </a>

          <Link
            to="/news"
            className={`nav-link-item ${isNewsActive ? 'active' : ''}`}
          >
            <span>Tin Tức</span>
            {isNewsActive && <motion.div layoutId="navIndicator" className="nav-active-bar" />}
          </Link>

          <a
            href="#download"
            onClick={handleDownloadClick}
            className={`nav-link-item ${isDownloadActive ? 'active' : ''}`}
          >
            <span>Tải Game</span>
            {isDownloadActive && <motion.div layoutId="navIndicator" className="nav-active-bar" />}
          </a>

          {rechargeEnabled && (
            <Link
              to="/nap-tien"
              className={`nav-link-item nav-link-special ${isTopupActive ? 'active' : ''}`}
            >
              <span className="special-icon">🪙</span>
              <span>Nạp Tiền</span>
              {isTopupActive && <motion.div layoutId="navIndicator" className="nav-active-bar" />}
            </Link>
          )}

          {/* User Account CTA */}
          <Link
            to={user ? "/tai-khoan" : "/login"}
            className={`nav-account-btn ${isAccountActive ? 'active' : ''}`}
          >
            <span className="account-icon">
              {user ? '🏴‍☠️' : '👤'}
            </span>
            <span className="account-label">
              {user ? user.username : 'Tài Khoản'}
            </span>
            {user && (
              <span className="navbar-coin-badge">
                {Number(user.coin || 0).toLocaleString()} Coin
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          className={`mobile-toggle-btn ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          <span className="hamburger-line line-1"></span>
          <span className="hamburger-line line-2"></span>
          <span className="hamburger-line line-3"></span>
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mobile-drawer"
          >
            <div className="mobile-drawer-content">
              <a
                href="/"
                onClick={handleHomeClick}
                className={`mobile-nav-item ${isHomeActive ? 'active' : ''}`}
              >
                ⚓ Trang Chủ
              </a>
              <Link
                to="/news"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`mobile-nav-item ${isNewsActive ? 'active' : ''}`}
              >
                📜 Tin Tức & Sự Kiện
              </Link>
              <a
                href="#download"
                onClick={handleDownloadClick}
                className={`mobile-nav-item ${isDownloadActive ? 'active' : ''}`}
              >
                ⚡ Tải Game
              </a>
              {rechargeEnabled && (
                <Link
                  to="/nap-tien"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`mobile-nav-item special ${isTopupActive ? 'active' : ''}`}
                >
                  🪙 Nạp Tiền
                </Link>
              )}
              <Link
                to={user ? "/tai-khoan" : "/login"}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`mobile-nav-item account-tab ${isAccountActive ? 'active' : ''}`}
              >
                👤 {user ? `${user.username} (${Number(user.coin || 0).toLocaleString()} Coin)` : 'Đăng Nhập / Đăng Ký'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
