import React, { useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import UserSubnav from '../components/account/UserSubnav';
import ProfileCard from '../components/account/ProfileCard';
import ChangePasswordCard from '../components/account/ChangePasswordCard';

export default function AccountPage() {
  const { user, loading, fetchUser } = useAuth();
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'account';

  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [changePassSubmitting, setChangePassSubmitting] = useState(false);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage((prev) => (prev && prev.text === text ? null : prev));
    }, 6000);
  };

  const handleActivateAccount = async () => {
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await authService.activate();
      if (res.data.success) {
        await fetchUser();
        showMessage(
          'success',
          '🎉 Kích hoạt tài khoản thành công! Đã trừ 10 Coin. Bạn có thể tham gia trò chơi ngay.'
        );
      } else {
        showMessage('error', res.data.message || 'Kích hoạt thất bại! Vui lòng kiểm tra lại số dư.');
      }
    } catch (err) {
      console.error(err);
      showMessage('error', 'Lỗi kết nối máy chủ!');
    } finally {
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleChangePassword = async ({ oldPassword, newPassword, confirmPassword, resetForm }) => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return showMessage('error', 'Vui lòng điền đầy đủ tất cả các trường!');
    }
    if (newPassword.length < 3) {
      return showMessage('error', 'Mật khẩu mới phải từ 3 ký tự trở lên!');
    }
    if (newPassword !== confirmPassword) {
      return showMessage('error', 'Mật khẩu mới và xác nhận mật khẩu không khớp!');
    }

    setChangePassSubmitting(true);
    setMessage(null);
    try {
      const res = await authService.changePassword(oldPassword, newPassword);
      if (res.data.success) {
        showMessage('success', '✔ Đổi mật khẩu thành công!');
        resetForm();
      } else {
        showMessage('error', res.data.message || 'Đổi mật khẩu thất bại!');
      }
    } catch (err) {
      console.error(err);
      showMessage('error', 'Lỗi kết nối máy chủ!');
    } finally {
      setChangePassSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="game-page-loading">
        <div className="anchor-spinner">⚓</div>
        <p>Đang tải thông tin thuyền trưởng...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="account-page-view">
      <div className="page-standard-container">
        {/* Navigation Sub-bar */}
        <UserSubnav activeTab={currentTab} />

        {/* Global Notifications inside Account Page */}
        {message && (
          <div className={`page-alert alert-${message.type}`}>
            <span className="alert-icon">{message.type === 'success' ? '✔' : '⚠️'}</span>
            <span>{message.text}</span>
          </div>
        )}

        {/* Tab Content */}
        <div className="account-content-card">
          {currentTab === 'account' ? (
            <ProfileCard
              user={user}
              onActivate={handleActivateAccount}
              submitting={submitting}
            />
          ) : (
            <ChangePasswordCard
              onSubmit={handleChangePassword}
              submitting={changePassSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
