import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/auth/AuthForm';
import '../styles/admin.css';

const ROUTE_INFO = {
  '/admin': { title: 'Bảng Điều Khiển Hệ Thống', subtitle: 'Tổng quan chỉ số máy chủ, doanh thu nạp và người chơi', icon: '📊' },
  '/admin/accounts': { title: 'Quản Lý Tài Khoản', subtitle: 'Tra cứu thông tin, vật phẩm và trạng thái nhân vật', icon: '👤' },
  '/admin/coins': { title: 'Quản Lý Nạp Tiền & Coin', subtitle: 'Cộng trừ coin thủ công và cấu hình reset mốc nạp', icon: '💰' },
  '/admin/giftcodes': { title: 'Quản Lý Giftcode', subtitle: 'Tạo mã code quà tặng và theo dõi lượt sử dụng', icon: '🎁' },
  '/admin/news': { title: 'Quản Lý Tin Tức & Bài Viết', subtitle: 'Biên tập bài viết, thông báo và sự kiện', icon: '📰' },
  '/admin/items': { title: 'Quản Lý Vật Phẩm & Dữ Liệu', subtitle: 'Cấu hình 13 bảng dữ liệu trang bị, rương và shop', icon: '💎' },
  '/admin/auctions': { title: 'Quản Lý Phiên Đấu Giá', subtitle: 'Theo dõi và quản lý các phiên đấu giá toàn server', icon: '⚖️' },
  '/admin/banking': { title: 'Quản Lý Đơn Nạp Banking', subtitle: 'Duyệt đơn nạp thẻ, cấu hình sự kiện x2 x3', icon: '🏦' },
  '/admin/logs': { title: 'Lịch Sử Hoạt Động Người Chơi', subtitle: 'Nhật ký giao dịch, tiêu ruby, rơi đồ và buff', icon: '📜' },
  '/admin/audit-logs': { title: 'Nhật Ký Thao Tác Quản Trị', subtitle: 'Ghi lại mọi thay đổi do Ban Quản Trị thực hiện', icon: '🛡️' },
  '/admin/anti-cheat': { title: 'Radar Chống Hack & Dupe', subtitle: 'Hệ thống đối soát tự động phát hiện gian lận', icon: '🚨' },
};

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [message, setMessage] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  // Automatically close mobile sidebar when path changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const showMessage = useCallback((type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage((prev) => (prev && prev.text === text ? null : prev));
    }, 5000);
  }, []);

  const outletContext = useMemo(() => ({ showMessage }), [showMessage]);

  const handleRefresh = () => {
    setIsSpinning(true);
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setIsSpinning(false), 600);
  };

  const currentRouteMeta = useMemo(() => {
    const match = ROUTE_INFO[location.pathname];
    if (match) return match;
    for (const key of Object.keys(ROUTE_INFO)) {
      if (key !== '/admin' && location.pathname.startsWith(key)) {
        return ROUTE_INFO[key];
      }
    }
    return { title: 'Bảng Quản Trị', subtitle: 'Hệ thống quản lý game', icon: '⚡' };
  }, [location.pathname]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--admin-bg-base, #080d1a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00d2ff' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚡</div>
          <p style={{ fontWeight: 600 }}>Đang khởi tạo hệ thống quản trị Modern Dashboard...</p>
        </div>
      </div>
    );
  }

  // Not logged in: show admin login form
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 30%, #0d1a38 0%, #080d1a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25), rgba(0, 210, 255, 0.25))',
              border: '1px solid rgba(0, 210, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              margin: '0 auto 12px auto',
              boxShadow: '0 0 20px rgba(0, 210, 255, 0.3)'
            }}>
              🛡️
            </div>
            <h2 style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #00d2ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              fontSize: '22px',
              fontWeight: 800,
              letterSpacing: '1px'
            }}>
              HTTH ADMIN CONSOLE
            </h2>
            <p style={{ color: '#8294ae', fontSize: '13px', marginTop: '6px' }}>Đăng nhập tài khoản quản trị để truy cập</p>
          </div>
          <AuthForm title="🔐 ĐĂNG NHẬP QUẢN TRỊ" />
        </div>
      </div>
    );
  }

  // Logged in but not admin
  const isUserAdmin = user.username === 'admin' || user.admin === 1 || user.admin === '1';
  if (!isUserAdmin) {
    return (
      <div style={{ minHeight: '100vh', background: '#080d1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{
          textAlign: 'center',
          padding: '44px 32px',
          maxWidth: '440px',
          background: 'rgba(17, 29, 56, 0.85)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          borderRadius: '14px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
          <h2 style={{ color: '#f43f5e', margin: 0, fontSize: '20px', fontWeight: 800 }}>TRUY CẬP BỊ TỪ CHỐI</h2>
          <p style={{ color: '#94a3b8', marginTop: '12px', fontSize: '14px', lineHeight: 1.5 }}>
            Tài khoản <strong style={{ color: '#fff' }}>{user.username}</strong> không có quyền truy cập bảng điều khiển quản trị viên.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '24px',
              padding: '10px 22px',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #0284c7 0%, #00d2ff 100%)',
              color: '#06101e',
              fontWeight: 700,
              borderRadius: '8px',
              fontSize: '13.5px'
            }}
          >
            🏠 Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Mobile Header Bar */}
      <div className="admin-mobile-header">
        <button
          className="admin-hamburger-btn"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle Sidebar"
        >
          ☰
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🛡️</span>
          <span style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #00d2ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            fontSize: '15px'
          }}>
            ADMIN CONSOLE
          </span>
        </div>
        <button
          className="admin-hamburger-btn"
          onClick={handleRefresh}
          title="Làm mới dữ liệu"
        >
          🔄
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Modern Sidebar */}
      <aside className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-brand">
            <div className="admin-brand-icon">
              🛡️
            </div>
            {!isSidebarCollapsed && (
              <div className="admin-brand-info">
                <span className="admin-logo-text">HTTH CONSOLE</span>
                <span className="admin-brand-subtitle">Hệ Thống Quản Trị</span>
              </div>
            )}
          </Link>

          <button
            className="admin-sidebar-toggle-btn"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={isSidebarCollapsed ? 'Mở rộng thanh menu' : 'Thu gọn thanh menu'}
          >
            {isSidebarCollapsed ? '▶' : '◀'}
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          <SidebarLink to="/admin" currentPath={location.pathname} onRefresh={handleRefresh} exact icon="📊">
            Dashboard
          </SidebarLink>
          <SidebarLink to="/admin/accounts" currentPath={location.pathname} onRefresh={handleRefresh} icon="👤">
            Quản lý Tài khoản
          </SidebarLink>
          <SidebarLink to="/admin/coins" currentPath={location.pathname} onRefresh={handleRefresh} icon="💰">
            Quản lý Nạp tiền
          </SidebarLink>
          <SidebarLink to="/admin/giftcodes" currentPath={location.pathname} onRefresh={handleRefresh} icon="🎁">
            Quản lý Giftcode
          </SidebarLink>
          <SidebarLink to="/admin/news" currentPath={location.pathname} onRefresh={handleRefresh} icon="📰">
            Quản lý Tin Tức
          </SidebarLink>
          <SidebarLink to="/admin/items" currentPath={location.pathname} onRefresh={handleRefresh} icon="💎">
            Quản lý Vật phẩm
          </SidebarLink>
          <SidebarLink to="/admin/auctions" currentPath={location.pathname} onRefresh={handleRefresh} icon="⚖️">
            Quản lý Đấu Giá
          </SidebarLink>
          <SidebarLink to="/admin/banking" currentPath={location.pathname} onRefresh={handleRefresh} icon="🏦">
            Quản lý Banking
          </SidebarLink>
          <SidebarLink to="/admin/logs" currentPath={location.pathname} onRefresh={handleRefresh} icon="📜">
            Lịch sử Người chơi
          </SidebarLink>
          <SidebarLink to="/admin/audit-logs" currentPath={location.pathname} onRefresh={handleRefresh} icon="🛡️">
            Nhật ký Quản trị
          </SidebarLink>
          <SidebarLink to="/admin/anti-cheat" currentPath={location.pathname} onRefresh={handleRefresh} icon="🚨">
            Radar Chống Hack
          </SidebarLink>
        </nav>

        <div className="admin-sidebar-footer">
          <Link
            to="/"
            className="admin-sidebar-exit-btn"
            title="Thoát về Website"
          >
            <span className="admin-sidebar-icon">🌐</span>
            {!isSidebarCollapsed && <span className="admin-sidebar-text">Về Trang Chủ Web</span>}
          </Link>
        </div>
      </aside>

      {/* Main Column: Header + Main Content */}
      <div className="admin-main-wrapper">
        {/* Desktop Top Header Bar */}
        <header className="admin-header">
          <div className="admin-header-left">
            <div className="admin-header-page-info">
              <h1 className="admin-header-title">
                <span>{currentRouteMeta.icon}</span>
                <span>{currentRouteMeta.title}</span>
                <span className="admin-header-title-dot" />
              </h1>
              <span className="admin-header-subtitle">
                {currentRouteMeta.subtitle}
              </span>
            </div>
          </div>

          <div className="admin-header-right">
            {/* Live Status Indicator */}
            <div className="admin-status-pill">
              <span className="admin-pulse-dot" />
              <span>Server Online</span>
            </div>

            {/* Quick Action: Radar if not already on anti-cheat */}
            {location.pathname !== '/admin/anti-cheat' && (
              <Link to="/admin/anti-cheat" className="admin-header-btn">
                <span>🚨</span>
                <span>Radar Scan</span>
              </Link>
            )}

            {/* Refresh Action */}
            <button
              onClick={handleRefresh}
              className="admin-header-btn"
              title="Làm mới dữ liệu trang"
            >
              <span style={{
                display: 'inline-block',
                transform: isSpinning ? 'rotate(360deg)' : 'none',
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                🔄
              </span>
              <span>Làm Mới</span>
            </button>

            {/* Admin User Chip */}
            <div className="admin-user-pill">
              <div className="admin-avatar">
                {(user.username || 'A')[0].toUpperCase()}
              </div>
              <div className="admin-user-info">
                <span className="admin-user-name">{user.username}</span>
                <span className="admin-user-role">Quản Trị Viên</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Main Content */}
        <main className="admin-main-content">
          {message && (
            <div className={`alert alert-${message.type}`} style={{ marginBottom: '20px' }}>
              {message.text}
            </div>
          )}
          <Outlet key={refreshKey} context={outletContext} />
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ to, currentPath, onRefresh, icon, children, exact = false }) {
  const isActive = exact ? currentPath === to : currentPath.startsWith(to);

  const handleClick = (e) => {
    if (isActive && onRefresh) {
      e.preventDefault();
      onRefresh();
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`admin-sidebar-link ${isActive ? 'active' : ''}`}
      title={typeof children === 'string' ? children : ''}
    >
      <span className="admin-sidebar-icon">{icon}</span>
      <span className="admin-sidebar-text">{children}</span>
    </Link>
  );
}
