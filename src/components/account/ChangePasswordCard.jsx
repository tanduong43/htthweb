import React, { useState } from 'react';

export default function ChangePasswordCard({ onSubmit, submitting }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      oldPassword,
      newPassword,
      confirmPassword,
      resetForm: () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    });
  };

  return (
    <div className="change-password-panel">
      <div className="panel-title-bar">
        <span className="panel-icon">🔒</span>
        <div>
          <h3 className="panel-heading">ĐỔI MẬT KHẨU TÀI KHOẢN</h3>
          <span className="panel-sub">Cập nhật mật khẩu định kỳ để bảo vệ tài sản và nhân vật</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="password-form-body">
        <div className="gaming-input-group">
          <label className="input-label">Mật khẩu hiện tại</label>
          <div className="input-field-wrapper">
            <span className="input-adornment">🔑</span>
            <input
              type="password"
              placeholder="Nhập mật khẩu cũ..."
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              disabled={submitting}
              required
              className="gaming-input"
            />
          </div>
        </div>

        <div className="gaming-input-group">
          <label className="input-label">Mật khẩu mới</label>
          <div className="input-field-wrapper">
            <span className="input-adornment">🛡️</span>
            <input
              type="password"
              placeholder="Nhập mật khẩu mới (tối thiểu 3 ký tự)..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={submitting}
              required
              className="gaming-input"
            />
          </div>
        </div>

        <div className="gaming-input-group">
          <label className="input-label">Xác nhận mật khẩu mới</label>
          <div className="input-field-wrapper">
            <span className="input-adornment">✨</span>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu mới..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={submitting}
              required
              className="gaming-input"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-update-password"
        >
          {submitting ? 'ĐANG CẬP NHẬT...' : '✔ CẬP NHẬT MẬT KHẨU'}
        </button>
      </form>
    </div>
  );
}
