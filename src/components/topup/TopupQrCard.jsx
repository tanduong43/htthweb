import React from 'react';

export default function TopupQrCard({
  activeDeposit,
  bankConfig,
  user
}) {
  const qrUrl = activeDeposit
    ? activeDeposit.vietqrUrl
    : `https://img.vietqr.io/image/${bankConfig.bankId}-${bankConfig.accountNo}-compact2.png?addInfo=${encodeURIComponent('NAP ' + (user?.username || '').replace(/[^a-zA-Z0-9]/g, ''))}&accountName=${encodeURIComponent(bankConfig.accountName)}`;

  return (
    <div className="topup-qr-container">
      <div className="qr-badge-header">
        <span className="qr-badge-icon">📲</span>
        <h3 className="qr-card-title">
          {activeDeposit ? 'QUÉT MÃ VIETQR THANH TOÁN' : 'MÃ VIETQR THANH TOÁN MẪU'}
        </h3>
      </div>

      <div className="qr-image-frame">
        <img
          src={qrUrl}
          alt="VietQR Chuyển khoản"
          className="qr-image"
        />
        <div className="qr-bank-tag">
          <span className="bank-logo-badge">MB</span>
          <span>{bankConfig.bankName || 'Ngân Hàng MB Bank'}</span>
        </div>
      </div>

      {activeDeposit && activeDeposit.status === 0 && activeDeposit.payosUrl && (
        <div className="payos-cta-wrap">
          <a
            href={activeDeposit.payosUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-payos-link"
          >
            💳 Thanh toán trực tiếp qua PayOS
          </a>
        </div>
      )}

      {/* Real-time Order Pulse Status */}
      <div className="qr-status-indicator">
        {activeDeposit ? (
          activeDeposit.status === 0 ? (
            <div className="status-pulse-row waiting">
              <div className="live-spinner"></div>
              <span>Hệ thống đang chờ nhận chuyển khoản từ ngân hàng...</span>
            </div>
          ) : activeDeposit.status === 1 || activeDeposit.status === 2 ? (
            <div className="status-pulse-row success">
              <span>✅ Giao dịch đã hoàn tất và cộng Coin thành công!</span>
            </div>
          ) : (
            <div className="status-pulse-row rejected">
              <span>❌ Giao dịch đã bị từ chối hoặc hết hạn.</span>
            </div>
          )
        ) : (
          <p className="qr-instruction-hint">
            💡 Nhập số tiền ở bên cạnh và nhấn <strong>Tạo Mã QR</strong> để hệ thống tạo mã quét tự động kèm cú pháp chuyển khoản chính xác nhất.
          </p>
        )}
      </div>
    </div>
  );
}
