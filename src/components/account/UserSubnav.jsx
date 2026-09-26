import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';

export default function UserSubnav({ activeTab }) {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const { rechargeEnabled } = useConfig();

  return (
    <div className="account-subnav-dock">
      <div className="subnav-pill-group">
        <button
          className={`account-subnav-btn ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => navigate('/tai-khoan')}
        >
          <span className="btn-icon">👤</span>
          <span>Thông Tin Cá Nhân</span>
        </button>

        <button
          className={`account-subnav-btn ${activeTab === 'change-password' ? 'active' : ''}`}
          onClick={() => navigate('/tai-khoan?tab=change-password')}
        >
          <span className="btn-icon">🔒</span>
          <span>Đổi Mật Khẩu</span>
        </button>

        {rechargeEnabled && (
          <button
            className="account-subnav-btn special"
            onClick={() => navigate('/nap-tien')}
          >
            <span className="btn-icon">🪙</span>
            <span>Nạp Tiền Tự Động</span>
          </button>
        )}
      </div>

      <button className="subnav-logout-btn" onClick={handleLogout}>
        <span className="btn-icon">🚪</span>
        <span>Đăng Xuất</span>
      </button>
    </div>
  );
}
