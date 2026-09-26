import React from 'react';
import { formatCurrency } from '../../utils/formatters';

export default function TopupAmountSelector({
  activeDeposit,
  depositMultiplier,
  transferAmount,
  setTransferAmount,
  onCreateDeposit,
  onCancelDeposit,
  onConfirmPayment,
  onCopyText,
  creating,
  confirming,
  timeLeft,
  getStatusBadge
}) {
  return (
    <div className="topup-action-container">
      {activeDeposit ? (
        /* View when an active deposit is in progress */
        <div className="active-deposit-sheet">
          <div className="sheet-top-header">
            <div className="sheet-title-group">
              <span className="sheet-cart-icon">🛒</span>
              <h3 className="sheet-title">ĐƠN NẠP ĐANG THỰC HIỆN</h3>
            </div>
            {activeDeposit.status === 0 && (
              <button
                onClick={onCancelDeposit}
                className="btn-cancel-order"
                disabled={creating}
              >
                Hủy đơn
              </button>
            )}
          </div>

          <div className="order-details-card">
            {/* Code */}
            <div className="order-detail-row">
              <span className="detail-label">Mã giao dịch</span>
              <div className="detail-value-wrap">
                <span className="code-highlight">{activeDeposit.code}</span>
              </div>
            </div>

            {/* Amount */}
            <div className="order-detail-row">
              <span className="detail-label">Số tiền cần chuyển</span>
              <div className="detail-value-wrap">
                <strong className="amount-highlight">
                  {formatCurrency(activeDeposit.amount)} VNĐ
                </strong>
                <button
                  type="button"
                  onClick={() => onCopyText(activeDeposit.amount.toString(), 'Số tiền')}
                  className="copy-pill-btn"
                >
                  Sao chép
                </button>
              </div>
            </div>

            {/* Expected Coin */}
            <div className="order-detail-row">
              <span className="detail-label">Quy đổi nhận được</span>
              <div className="detail-value-wrap">
                <span className="coin-receive-highlight">
                  +{((activeDeposit.amount / 1000) * depositMultiplier).toLocaleString()} Coin
                </span>
                {depositMultiplier > 1 && (
                  <span className="mult-glow-tag">🔥 x{depositMultiplier}</span>
                )}
              </div>
            </div>

            {/* Transfer Note / Syntax */}
            <div className="order-detail-block">
              <span className="detail-label">Nội dung chuyển khoản (Bắt buộc)</span>
              <div className="transfer-syntax-row">
                <span className="syntax-text">{activeDeposit.transferContent}</span>
                <button
                  type="button"
                  onClick={() => onCopyText(activeDeposit.transferContent, 'Nội dung chuyển khoản')}
                  className="copy-syntax-btn"
                >
                  📋 Sao chép
                </button>
              </div>
              <p className="syntax-warning">
                ⚠️ Hãy ghi chính xác nội dung trên để hệ thống tự động nhận diện và nạp Coin tức thì!
              </p>
            </div>

            {/* Timer */}
            <div className="order-detail-row">
              <span className="detail-label">Thời gian còn lại</span>
              <span className="countdown-pill">
                ⏳ {timeLeft || 'Đang đếm ngược...'}
              </span>
            </div>

            {/* Status */}
            <div className="order-detail-row">
              <span className="detail-label">Trạng thái</span>
              <div>{getStatusBadge(activeDeposit.status)}</div>
            </div>
          </div>

          {activeDeposit.status === 0 && (
            <button
              onClick={onConfirmPayment}
              className="btn-confirm-payment-action"
              disabled={confirming}
            >
              {confirming ? (
                <span>Đang gửi thông báo...</span>
              ) : (
                <span>✔ XÁC NHẬN ĐÃ CHUYỂN KHOẢN XONG</span>
              )}
            </button>
          )}
        </div>
      ) : (
        /* View to create a new deposit order */
        <div className="create-deposit-form">
          <div className="sheet-top-header">
            <div className="sheet-title-group">
              <span className="sheet-cart-icon">🏦</span>
              <h3 className="sheet-title">CHỌN SỐ TIỀN MUỐN NẠP</h3>
            </div>
          </div>

          {/* Preset Buttons Grid */}
          <div className="presets-block">
            <label className="field-group-label">Chọn nhanh hạn mức nạp:</label>
            <div className="presets-grid">
              {[100000, 200000, 500000, 1000000].map((amt) => {
                const isSelected = transferAmount === amt.toString();
                const expectedCoins = (amt / 1000) * depositMultiplier;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setTransferAmount(amt.toString());
                    }}
                    className={`preset-card ${isSelected ? 'active' : ''}`}
                  >
                    <span className="preset-amount">{formatCurrency(amt)}đ</span>
                    <span className="preset-coins">
                      +{expectedCoins.toLocaleString()} Coin
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div className="custom-input-block">
            <label className="field-group-label">Hoặc nhập số tiền khác (VNĐ):</label>
            <div className="gaming-input-wrapper">
              <span className="input-unit">₫</span>
              <input
                type="number"
                min="10000"
                step="1000"
                placeholder="Ví dụ: 150000..."
                value={transferAmount}
                onChange={(e) => {
                  setTransferAmount(e.target.value);
                }}
                className="custom-topup-input"
                required
              />
            </div>
          </div>

          <button
            onClick={() => onCreateDeposit(transferAmount)}
            disabled={creating}
            className="btn-create-qr-action"
          >
            {creating ? (
              <span className="btn-flex">
                <span className="mini-spinner"></span> Đang khởi tạo đơn...
              </span>
            ) : (
              <span>⚓ TẠO MÃ QR NẠP TIỀN</span>
            )}
          </button>

          {/* Conversion Hint Box */}
          <div className="conversion-info-box">
            <div className="info-title-row">
              <span className="info-bulb">💡</span>
              <span className="info-rate-text">
                Tỷ lệ: 1.000 VNĐ = {depositMultiplier} Coin {depositMultiplier > 1 ? `(🔥 Đang x${depositMultiplier})` : ''} = {(depositMultiplier * 100).toLocaleString()} Ruby = {(depositMultiplier * 1000).toLocaleString()} Extol.
              </span>
            </div>
            {transferAmount && !isNaN(parseInt(transferAmount, 10)) && parseInt(transferAmount, 10) >= 10000 ? (
              <div className="actual-conversion-preview">
                👉 <strong>Thực nhận:</strong> {((parseInt(transferAmount, 10) / 1000) * depositMultiplier).toLocaleString()} Coin = {(((parseInt(transferAmount, 10) / 1000) * depositMultiplier) * 100).toLocaleString()} Ruby = {(((parseInt(transferAmount, 10) / 1000) * depositMultiplier) * 1000).toLocaleString()} Extol
              </div>
            ) : null}
            <p className="auto-credit-note">
              Sau khi bạn chuyển khoản thành công đúng cú pháp, số dư Coin sẽ tự động cập nhật trong vòng vài giây mà không cần tải lại trang.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
