import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/auth/AuthForm';
import '../styles/admin.css';

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [message, setMessage] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Automatically close mobile sidebar when path changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage((prev) => (prev && prev.text === text ? null : prev));
    }, 5000);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (loading) {
    return <div className="loader">Đang tải dữ liệu quản trị...</div>;
  }

  // Not logged in: show admin login form
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: '#090d14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '380px', padding: '16px' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '36px', marginBottom: '4px' }}>🛡️</div>
            <h2 style={{ color: '#ff3366', margin: 0, fontFamily: 'var(--font-heading)', fontSize: '20px' }}>ADMIN PANEL</h2>
            <p style={{ color: '#94a3b8', fontSize: '12.5px', marginTop: '4px' }}>Đăng nhập bằng tài khoản quản trị viên</p>
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
      <div style={{ minHeight: '100vh', background: '#090d14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="pirate-card" style={{ textAlign: 'center', padding: '50px 30px', maxWidth: '420px', borderColor: '#ff3366' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
          <h2 style={{ color: '#ff3366', fontFamily: 'var(--font-heading)' }}>TRUY CẬP BỊ TỪ CHỐI</h2>
          <p style={{ color: '#94a3b8', marginTop: '10px' }}>
            Tài khoản <strong style={{ color: '#fff' }}>{user.username}</strong> không có quyền truy cập trang quản trị.
          </p>
          <Link to="/" className="hero-btn-primary" style={{ display: 'inline-block', marginTop: '24px', padding: '10px 24px', textDecoration: 'none' }}>
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
        <h2 style={{ color: '#ff3366', margin: 0, fontSize: '18px', fontWeight: 'bold' }}>🛡️ ADMIN</h2>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <h2 className="admin-logo-text" style={{ color: '#ff3366', textAlign: 'center', margin: 0 }}>
            {isSidebarCollapsed ? '🛡️' : '🛡️ ADMIN PANEL'}
          </h2>
          <button
            className="admin-sidebar-toggle-btn"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={isSidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            {isSidebarCollapsed ? '▶' : '◀'}
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, padding: '10px 0' }}>
          <SidebarLink to="/admin" currentPath={location.pathname} onRefresh={handleRefresh} exact icon="📊">Dashboard</SidebarLink>
          <SidebarLink to="/admin/accounts" currentPath={location.pathname} onRefresh={handleRefresh} icon="👤">Quản lý Tài khoản</SidebarLink>
          <SidebarLink to="/admin/coins" currentPath={location.pathname} onRefresh={handleRefresh} icon="💰">Quản lý Nạp tiền</SidebarLink>
          <SidebarLink to="/admin/giftcodes" currentPath={location.pathname} onRefresh={handleRefresh} icon="🎁">Quản lý Giftcode</SidebarLink>
          <SidebarLink to="/admin/news" currentPath={location.pathname} onRefresh={handleRefresh} icon="📰">Quản lý Tin Tức</SidebarLink>
          <SidebarLink to="/admin/items" currentPath={location.pathname} onRefresh={handleRefresh} icon="💎">Quản lý Vật phẩm</SidebarLink>
          <SidebarLink to="/admin/auctions" currentPath={location.pathname} onRefresh={handleRefresh} icon="⚖️">Quản lý Đấu Giá</SidebarLink>
          <SidebarLink to="/admin/banking" currentPath={location.pathname} onRefresh={handleRefresh} icon="🏦">Quản lý Banking</SidebarLink>
          <SidebarLink to="/admin/logs" currentPath={location.pathname} onRefresh={handleRefresh} icon="📜">Lịch sử Người chơi</SidebarLink>
        </nav>

        <div className="admin-sidebar-footer" style={{ padding: '15px', marginTop: 'auto' }}>
          <Link
            to="/"
            className="btn btn-outline"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: '#334155',
              color: '#94a3b8',
              gap: '10px',
              padding: isSidebarCollapsed ? '10px 0' : '10px 15px',
              textDecoration: 'none',
              borderRadius: '6px'
            }}
            title="Thoát về Web"
          >
            <span className="admin-sidebar-icon">🏠</span>
            {!isSidebarCollapsed && <span className="admin-sidebar-text">Thoát về Web</span>}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main-content">
        {message && (
          <div className={`alert alert-${message.type}`} style={{ marginBottom: '20px' }}>
            {message.text}
          </div>
        )}
        <Outlet key={refreshKey} context={{ showMessage }} />
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
