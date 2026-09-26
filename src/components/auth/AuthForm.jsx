import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';

export default function AuthForm({ title = '⚓ ĐĂNG NHẬP' }) {
  const { fetchUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isRegisterPath = location.pathname === '/register';
  const isLoginPath = location.pathname === '/login';

  const [isRegisterState, setIsRegisterState] = useState(false);
  const isRegister = isRegisterPath || isLoginPath ? isRegisterPath : isRegisterState;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Captcha state
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaSvg, setCaptchaSvg] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [loadingCaptcha, setLoadingCaptcha] = useState(false);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage((prev) => (prev && prev.text === text ? null : prev));
    }, 5000);
  };

  // Fetch a new captcha challenge
  const loadCaptcha = useCallback(async () => {
    setLoadingCaptcha(true);
    try {
      const res = await authService.getCaptcha();
      if (res.data && res.data.success) {
        setCaptchaToken(res.data.captchaToken);
        setCaptchaSvg(res.data.svg);
        setCaptchaAnswer('');
      }
    } catch (err) {
      console.error('Failed to load captcha:', err);
    } finally {
      setLoadingCaptcha(false);
    }
  }, []);

  // Automatically load captcha whenever switching into register mode
  useEffect(() => {
    if (isRegister) {
      loadCaptcha();
    }
  }, [isRegister, loadCaptcha]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      return showMessage('error', 'Vui lòng điền đầy đủ tên tài khoản và mật khẩu!');
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await authService.login(username, password);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        await fetchUser();
        showMessage('success', 'Đăng nhập thành công! Đang chuyển hướng...');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        if (isLoginPath) {
          navigate('/tai-khoan');
        }
      } else {
        showMessage('error', res.data.message || 'Tài khoản hoặc mật khẩu không chính xác!');
      }
    } catch (err) {
      console.error(err);
      showMessage('error', 'Lỗi kết nối máy chủ!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      return showMessage('error', 'Vui lòng điền đầy đủ thông tin!');
    }
    const usernameRegex = /^[a-z0-9]+$/;
    if (!usernameRegex.test(username)) {
      return showMessage(
        'error',
        'Tên tài khoản chỉ được phép sử dụng chữ thường (a-z) và chữ số (0-9)!'
      );
    }
    const passwordRegex = /^[a-z0-9]+$/;
    if (!passwordRegex.test(password)) {
      return showMessage(
        'error',
        'Mật khẩu chỉ được phép sử dụng chữ thường (a-z) và chữ số (0-9)!'
      );
    }
    if (password !== confirmPassword) {
      return showMessage('error', 'Mật khẩu xác nhận không khớp!');
    }
    if (!captchaAnswer.trim()) {
      return showMessage('error', 'Vui lòng nhập mã bảo vệ (Captcha)!');
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await authService.register(
        username,
        password,
        captchaToken,
        captchaAnswer.trim()
      );
      if (res.data.success) {
        setIsRegisterState(false);
        showMessage('success', res.data.message || 'Đăng ký thành công! Vui lòng đăng nhập.');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setCaptchaAnswer('');
        if (isRegisterPath) {
          navigate('/login');
        }
      } else {
        showMessage('error', res.data.message || 'Đăng ký thất bại!');
        loadCaptcha();
      }
    } catch (err) {
      console.error(err);
      showMessage('error', 'Lỗi kết nối máy chủ!');
      loadCaptcha();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card-panel">
      <div className="auth-card-header">
        <span className="auth-emblem">⚓</span>
        <h2 className="auth-title">
          {isRegister ? 'ĐĂNG KÝ THUYỀN TRƯỞNG' : title.replace(/^[^\w\s]+/, '').trim() || 'ĐĂNG NHẬP'}
        </h2>
        <span className="auth-subtitle">
          {isRegister
            ? 'Khởi đầu hải trình vĩ đại của bạn tại Thế Giới Hải Tặc'
            : 'Chào mừng thuyền trưởng quay trở lại tàu chiến!'}
        </span>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`auth-alert alert-${message.type}`}
          >
            <span className="alert-icon">{message.type === 'success' ? '✔' : '⚠️'}</span>
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={isRegister ? handleRegisterSubmit : handleLoginSubmit} autoComplete="on" className="auth-form-body">
        <div className="gaming-input-group">
          <label className="input-label">Tên tài khoản</label>
          <div className="input-field-wrapper">
            <span className="input-adornment">👤</span>
            <input
              type="text"
              name="username"
              placeholder="Nhập tên tài khoản (a-z, 0-9)..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting}
              autoComplete="username"
              required
              className="gaming-input"
            />
          </div>
        </div>

        <div className="gaming-input-group">
          <label className="input-label">Mật khẩu</label>
          <div className="input-field-wrapper">
            <span className="input-adornment">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
              className="gaming-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password-btn"
              tabIndex={-1}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? '👁️' : '🕶️'}
            </button>
          </div>
        </div>

        {isRegister && (
          <div className="gaming-input-group">
            <label className="input-label">Xác nhận mật khẩu</label>
            <div className="input-field-wrapper">
              <span className="input-adornment">🛡️</span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={submitting}
                autoComplete="new-password"
                required
                className="gaming-input"
              />
            </div>
          </div>
        )}

        {isRegister && (
          <div className="gaming-input-group">
            <label className="input-label">
              Mã bảo vệ (Captcha)
              <span className="label-tip">Nhấp hình để đổi mã</span>
            </label>
            <div className="captcha-input-row">
              <div className="input-field-wrapper captcha-field">
                <span className="input-adornment">🧩</span>
                <input
                  type="text"
                  name="captchaAnswer"
                  placeholder="Nhập 4 ký tự..."
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value.toUpperCase())}
                  disabled={submitting}
                  maxLength={6}
                  autoComplete="off"
                  spellCheck="false"
                  required
                  className="gaming-input captcha-text-input"
                />
              </div>

              <div className="captcha-display-box" title="Nhấp vào ảnh để đổi mã mới">
                {captchaSvg ? (
                  <img
                    src={captchaSvg}
                    alt="Mã bảo vệ"
                    className="captcha-svg-img"
                    onClick={loadCaptcha}
                  />
                ) : (
                  <div className="captcha-loading-box">
                    <span className="mini-spinner"></span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={loadCaptcha}
                  disabled={loadingCaptcha || submitting}
                  className="captcha-reload-btn"
                  title="Đổi mã bảo vệ khác"
                  aria-label="Đổi mã bảo vệ"
                >
                  <span className={`refresh-glyph ${loadingCaptcha ? 'is-loading' : ''}`}>🔄</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={submitting}
        >
          {submitting ? (
            <span className="btn-loading-flex">
              <span className="mini-spinner"></span> ĐANG XỬ LÝ...
            </span>
          ) : isRegister ? (
            '⚓ TẠO TÀI KHOẢN NGAY'
          ) : (
            '⚡ ĐĂNG NHẬP VÀO GAME'
          )}
        </button>
      </form>

      <div className="auth-card-footer">
        {isRegister ? (
          <p className="auth-switch-text">
            Đã có tài khoản thuyền trưởng?{' '}
            <button
              type="button"
              className="auth-switch-link"
              onClick={() => {
                setMessage(null);
                if (isRegisterPath || isLoginPath) {
                  navigate('/login');
                } else {
                  setIsRegisterState(false);
                }
              }}
            >
              Đăng nhập ngay
            </button>
          </p>
        ) : (
          <p className="auth-switch-text">
            Chưa gia nhập băng hải tặc?{' '}
            <button
              type="button"
              className="auth-switch-link"
              onClick={() => {
                setMessage(null);
                if (isRegisterPath || isLoginPath) {
                  navigate('/register');
                } else {
                  setIsRegisterState(true);
                }
              }}
            >
              Đăng ký tài khoản mới
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
