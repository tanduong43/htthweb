import React from 'react';

export default function ProfileCard({ user, onActivate, submitting }) {
  if (!user) return null;

  return (
    <div className="account-profile-card">
      <div className="profile-hero-banner">
        <div className="profile-avatar-wrap">
          <span className="profile-skull-icon">🏴‍☠️</span>
          <span className="status-dot-indicator"></span>
        </div>
        <div className="profile-intro-text">
          <span className="profile-role-badge">THUYỀN TRƯỞNG</span>
          <h2 className="profile-username">{user.username}</h2>
          <span className="profile-server-tag">
            Máy chủ: <strong>{user.server || 'Làng Cối Xay Gió (S1)'}</strong>
          </span>
        </div>
      </div>

      <div className="profile-stats-grid">
        {/* Coin Balance */}
        <div className="profile-stat-box box-gold">
          <span className="stat-icon">🪙</span>
          <div className="stat-content">
            <span className="stat-title">SỐ DƯ COIN</span>
            <strong className="stat-number">
              {Number(user.coin || 0).toLocaleString()} <span className="stat-unit">Coin</span>
            </strong>
          </div>
        </div>

        {/* Character Name */}
        <div className="profile-stat-box box-cyan">
          <span className="stat-icon">⚔️</span>
          <div className="stat-content">
            <span className="stat-title">NHÂN VẬT CHÍNH</span>
            <strong className="stat-number">
              {user.character || 'Chưa tạo nhân vật'}
            </strong>
          </div>
        </div>

        {/* Membership Status */}
        <div className="profile-stat-box box-emerald">
          <span className="stat-icon">📜</span>
          <div className="stat-content">
            <span className="stat-title">TRẠNG THÁI TÀI KHOẢN</span>
            {user.status === 1 ? (
              <span className="profile-status-badge active">
                ✔ ĐÃ KÍCH HOẠT
              </span>
            ) : (
              <span className="profile-status-badge inactive">
                ⏳ CHƯA KÍCH HOẠT
              </span>
            )}
          </div>
        </div>
      </div>

      {user.lock === 1 && (
        <div className="account-lock-alert">
          <span className="alert-icon">🚫</span>
          <div>
            <strong>TÀI KHOẢN ĐANG BỊ KHÓA (BANNED)</strong>
            <p>Vui lòng liên hệ Admin qua kênh hỗ trợ để được giải đáp chi tiết.</p>
          </div>
        </div>
      )}

      {/* Activation Action if not yet activated */}
      {user.status === 0 && (
        <div className="activation-action-box">
          <div className="activation-info-group">
            <span className="activation-icon">⚡</span>
            <div>
              <h4 className="activation-title">KÍCH HOẠT TƯ CÁCH THÀNH VIÊN</h4>
              <p className="activation-desc">
                Tài khoản của bạn chưa kích hoạt. Cần kích hoạt (phí 10 Coin) để đăng nhập vào Client game.
              </p>
            </div>
          </div>
          <button
            onClick={onActivate}
            disabled={submitting}
            className="btn-activate-account"
          >
            {submitting ? 'ĐANG KÍCH HOẠT...' : '⚡ KÍCH HOẠT THÀNH VIÊN (10 COIN)'}
          </button>
        </div>
      )}

      {user.status === 1 && (
        <div className="activation-ready-box">
          <span className="ready-icon">🎉</span>
          <span>
            Tài khoản đã sẵn sàng! Bạn có thể khởi động game và đăng nhập bằng tài khoản này.
          </span>
        </div>
      )}
    </div>
  );
}
