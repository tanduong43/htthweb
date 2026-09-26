import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useConfig } from '../context/ConfigContext';
import bankingService from '../services/bankingService';
import TopupQrCard from '../components/topup/TopupQrCard';
import TopupAmountSelector from '../components/topup/TopupAmountSelector';
import TopupHistoryTable from '../components/topup/TopupHistoryTable';
import AuthForm from '../components/auth/AuthForm';

export default function TopupPage() {
  const { user, loading, fetchUser } = useAuth();
  const socket = useSocket();
  const { rechargeEnabled } = useConfig();

  const [transferAmount, setTransferAmount] = useState('');
  const [message, setMessage] = useState(null);
  const [activeDeposit, setActiveDeposit] = useState(null);
  const [creating, setCreating] = useState(false);
  const [history, setHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState('');
  const [confirming, setConfirming] = useState(false);

  const [depositMultiplier, setDepositMultiplier] = useState(1);
  const [bankConfig, setBankConfig] = useState({
    bankId: 'MB',
    accountNo: '123456789999',
    accountName: 'NGUYEN VAN A',
    bankName: 'MB Bank (Ngân Hàng Quân Đội)',
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage((prev) => (prev && prev.text === text ? null : prev));
    }, 8000);
  };

  const handleCopyText = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      showMessage('success', `✔ Đã sao chép ${label}!`);
    } catch {
      showMessage('error', 'Không thể tự động sao chép. Vui lòng copy thủ công.');
    }
  };

  const fetchHistoryAndConfig = async () => {
    try {
      const configRes = await bankingService.getBankConfig();
      if (configRes.data && configRes.data.success) {
        setBankConfig({
          bankId: configRes.data.bankId,
          accountNo: configRes.data.accountNo,
          accountName: configRes.data.accountName,
          bankName: configRes.data.bankName,
        });
        if (configRes.data.depositMultiplier) {
          setDepositMultiplier(Number(configRes.data.depositMultiplier) || 1);
        }
      }

      const historyRes = await bankingService.getHistory();
      if (historyRes.data && historyRes.data.success) {
        setHistory(historyRes.data.history);
      }

      const activeRes = await bankingService.getActiveDeposit();
      if (activeRes.data && activeRes.data.success) {
        setActiveDeposit(activeRes.data.activeDeposit);
      } else {
        setActiveDeposit(null);
      }
    } catch (err) {
      console.error('Lỗi khi tải cấu hình và lịch sử nạp:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistoryAndConfig();
    }
  }, [user]);

  // Countdown timer hook for active deposit expiration
  useEffect(() => {
    if (!activeDeposit || !activeDeposit.expires_at) {
      setTimeLeft('');
      return;
    }

    const updateTimer = () => {
      const expiresAt = new Date(activeDeposit.expires_at).getTime();
      const now = Date.now();
      const diff = expiresAt - now;

      if (diff <= 0) {
        setTimeLeft('Đã hết hạn');
        handleExpiry();
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeDeposit]);

  const handleExpiry = async () => {
    try {
      const res = await bankingService.getActiveDeposit();
      if (res.data && res.data.success) {
        if (!res.data.activeDeposit) {
          setActiveDeposit(null);
          showMessage('warning', 'Đơn nạp tiền đã hết thời hạn thanh toán!');
          const historyRes = await bankingService.getHistory();
          if (historyRes.data && historyRes.data.success) {
            setHistory(historyRes.data.history);
          }
        }
      }
    } catch (err) {
      console.error('Lỗi kiểm tra hết hạn đơn:', err);
      setActiveDeposit(null);
    }
  };

  // Socket success and reject listeners
  useEffect(() => {
    if (!socket) return;

    const handleDepositSuccess = (data) => {
      const multNotice = data.multiplier && data.multiplier > 1 ? ` (x${data.multiplier})` : '';
      showMessage('success', `🎉 Nạp tiền thành công! Bạn đã được cộng ${Number(data.amount).toLocaleString()} Coin${multNotice}.`);

      setActiveDeposit((prev) => {
        if (prev && prev.code === data.code) {
          return { ...prev, status: data.status, real_amount: data.real_amount };
        }
        return prev;
      });

      setHistory((prev) =>
        prev.map((tx) =>
          tx.code === data.code ? { ...tx, status: data.status, real_amount: data.real_amount } : tx
        )
      );

      fetchUser();

      setTimeout(() => {
        setActiveDeposit(null);
        bankingService.getHistory().then((res) => {
          if (res.data && res.data.success) setHistory(res.data.history);
        });
      }, 4000);
    };

    const handleDepositRejected = (data) => {
      showMessage('error', `❌ Đơn nạp ${data.code} đã bị từ chối bởi Admin.`);

      setActiveDeposit((prev) => {
        if (prev && prev.code === data.code) {
          return { ...prev, status: data.status };
        }
        return prev;
      });

      setHistory((prev) =>
        prev.map((tx) => (tx.code === data.code ? { ...tx, status: data.status } : tx))
      );

      setTimeout(() => {
        setActiveDeposit(null);
        bankingService.getHistory().then((res) => {
          if (res.data && res.data.success) setHistory(res.data.history);
        });
      }, 4000);
    };

    const handleMultiplierChange = (data) => {
      if (data && data.multiplier) {
        setDepositMultiplier(Number(data.multiplier) || 1);
      }
    };

    const handleDepositWrongAmount = (data) => {
      showMessage(
        'info',
        data.message || `⚠️ Hệ thống nhận được ${Number(data.real_amount).toLocaleString()}đ (khác số tiền yêu cầu). Đang chờ Admin duyệt.`
      );
      bankingService.getActiveDeposit().then((res) => {
        if (res.data && res.data.success) setActiveDeposit(res.data.activeDeposit);
      });
      bankingService.getHistory().then((res) => {
        if (res.data && res.data.success) setHistory(res.data.history);
      });
    };

    socket.on('deposit_success', handleDepositSuccess);
    socket.on('deposit_rejected', handleDepositRejected);
    socket.on('deposit_multiplier_changed', handleMultiplierChange);
    socket.on('deposit_wrong_amount', handleDepositWrongAmount);

    return () => {
      socket.off('deposit_success', handleDepositSuccess);
      socket.off('deposit_rejected', handleDepositRejected);
      socket.off('deposit_multiplier_changed', handleMultiplierChange);
      socket.off('deposit_wrong_amount', handleDepositWrongAmount);
    };
  }, [socket, fetchUser]);

  const handleCreateDeposit = async (amountToCreate) => {
    if (!rechargeEnabled) {
      showMessage('error', '⚠️ Tính năng nạp thẻ hiện đang tạm đóng để bảo trì!');
      return;
    }

    if (!amountToCreate || amountToCreate.toString().trim() === '') {
      showMessage('error', '⚠️ Vui lòng chọn hoặc nhập số tiền cần nạp trước khi tạo mã QR!');
      return;
    }

    const finalAmount = parseInt(amountToCreate, 10);
    if (isNaN(finalAmount) || finalAmount < 10000) {
      showMessage('error', '⚠️ Số tiền nạp tối thiểu là 10.000 VNĐ');
      return;
    }

    if (activeDeposit) {
      const confirmCancel = window.confirm(
        `Bạn đang có đơn nạp ${activeDeposit.amount.toLocaleString()}đ đang chờ thanh toán.\n\nNhấn OK nếu bạn muốn HỦY đơn cũ để tạo đơn mới.\nNhấn Cancel để tiếp tục thanh toán đơn cũ.`
      );
      if (!confirmCancel) {
        showMessage('info', 'Tiếp tục thanh toán đơn hàng hiện tại.');
        return;
      }

      try {
        setCreating(true);
        const cancelRes = await bankingService.cancelDeposit(activeDeposit.code);
        if (!cancelRes.data || !cancelRes.data.success) {
          showMessage('error', cancelRes.data?.message || 'Không thể hủy đơn cũ.');
          setCreating(false);
          return;
        }
      } catch (err) {
        console.error('Lỗi khi hủy đơn cũ:', err);
        showMessage('error', 'Lỗi khi hủy đơn cũ.');
        setCreating(false);
        return;
      }
    }

    try {
      setCreating(true);
      const res = await bankingService.createDeposit(finalAmount);
      if (res.data && res.data.success) {
        const activeRes = await bankingService.getActiveDeposit();
        if (activeRes.data && activeRes.data.success && activeRes.data.activeDeposit) {
          setActiveDeposit(activeRes.data.activeDeposit);
        } else {
          setActiveDeposit(res.data.deposit);
        }
        showMessage('success', '✔ Đã tạo yêu cầu nạp tiền! Vui lòng chuyển khoản đúng thông tin.');

        const historyRes = await bankingService.getHistory();
        if (historyRes.data && historyRes.data.success) {
          setHistory(historyRes.data.history);
        }
      } else {
        showMessage('error', res.data.message || 'Tạo đơn nạp thất bại.');
      }
    } catch (err) {
      console.error('Lỗi khi tạo đơn nạp:', err);
      showMessage('error', 'Lỗi máy chủ khi tạo đơn nạp.');
    } finally {
      setCreating(false);
    }
  };

  const handleCancelDeposit = async () => {
    if (!activeDeposit) return;
    const confirmCancel = window.confirm('Bạn có chắc chắn muốn hủy đơn nạp này không?');
    if (!confirmCancel) return;

    try {
      setCreating(true);
      const res = await bankingService.cancelDeposit(activeDeposit.code);
      if (res.data && res.data.success) {
        setActiveDeposit(null);
        showMessage('info', 'Đã hủy đơn nạp tiền.');
        const historyRes = await bankingService.getHistory();
        if (historyRes.data && historyRes.data.success) {
          setHistory(historyRes.data.history);
        }
      } else {
        showMessage('error', res.data.message || 'Hủy đơn nạp thất bại.');
      }
    } catch (err) {
      console.error('Lỗi khi hủy đơn:', err);
      showMessage('error', 'Lỗi hệ thống khi hủy đơn.');
    } finally {
      setCreating(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!activeDeposit) return;
    try {
      setConfirming(true);
      const res = await bankingService.confirmPayment(activeDeposit.code);
      if (res.data && res.data.success) {
        showMessage('success', '🔔 Đã gửi yêu cầu xác nhận thanh toán tới Admin. Vui lòng chờ kiểm tra!');
      } else {
        showMessage('error', res.data.message || 'Gửi yêu cầu thất bại.');
      }
    } catch (err) {
      console.error('Lỗi gửi xác nhận:', err);
      showMessage('error', 'Lỗi hệ thống khi gửi yêu cầu.');
    } finally {
      setConfirming(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 0:
        return <span className="status-badge badge-pending">⏳ Chờ thanh toán</span>;
      case 1:
        return <span className="status-badge badge-success">✔ Thành công</span>;
      case 2:
        return <span className="status-badge badge-warning">⚠️ Đã duyệt (Sai tiền)</span>;
      case 3:
        return <span className="status-badge badge-failed">❌ Thất bại</span>;
      case 4:
        return <span className="status-badge badge-cancelled">⊘ Đã hủy</span>;
      default:
        return <span className="status-badge badge-unknown">? Không rõ</span>;
    }
  };

  if (loading) {
    return (
      <div className="game-page-loading">
        <div className="anchor-spinner">⚓</div>
        <p>Đang chuẩn bị kho báu ngân khố...</p>
      </div>
    );
  }

  // Feature temporarily disabled
  if (!rechargeEnabled) {
    return (
      <div className="topup-page-view">
        <div className="page-standard-container">
          <div className="maintenance-box">
            <span className="maintenance-icon">🛠️</span>
            <h2 className="maintenance-title">TÍNH NĂNG NẠP TIỀN ĐANG TẠM ĐÓNG</h2>
            <p className="maintenance-desc">
              Hệ thống nạp thẻ và nạp ngân hàng hiện đang được Ban Quản Trị tạm dừng để bảo trì và nâng cấp cổng thanh toán tự động. Vui lòng quay lại sau!
            </p>
            <div className="maintenance-actions">
              <a href="/" className="hero-btn-primary">
                ⚓ Về Trang Chủ
              </a>
              <a href="/tai-khoan" className="hero-btn-secondary">
                👤 Quản Lý Tài Khoản
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login required
  if (!user) {
    return (
      <div className="topup-page-view">
        <div className="page-standard-container auth-wrapper-box">
          <AuthForm title="⚓ ĐĂNG NHẬP ĐỂ NẠP GAME" />
        </div>
      </div>
    );
  }

  return (
    <div className="topup-page-view">
      <div className="page-standard-container">
        {/* Page Top Banner */}
        <div className="topup-banner-header">
          <span className="topup-header-tag">KHO BÁU HẢI TẶC</span>
          <h1 className="topup-header-title">NẠP TIỀN QUA NGÂN HÀNG (TỰ ĐỘNG 24/7)</h1>
          <p className="topup-header-sub">
            Hệ thống thanh toán quét mã VietQR tự động khớp lệnh và cộng Coin trong 5-10 giây.
          </p>
        </div>

        {/* Global Alert Notification */}
        {message && (
          <div className={`page-alert alert-${message.type}`}>
            <span className="alert-icon">{message.type === 'success' ? '✔' : '⚠️'}</span>
            <span>{message.text}</span>
          </div>
        )}

        {/* Multiplier Event Banner */}
        {depositMultiplier > 1 && (
          <div className="multiplier-event-banner">
            <span className="multiplier-flame">🔥</span>
            <div className="multiplier-text-block">
              <strong className="multiplier-title">
                SỰ KIỆN NẠP X{depositMultiplier} ĐANG DIỄN RA!
              </strong>
              <span className="multiplier-desc">
                Nhân gấp <strong>{depositMultiplier} lần Coin</strong> cho mọi giao dịch nạp thành công!
              </span>
            </div>
          </div>
        )}

        {/* Current Balance Ribbon */}
        <div className="current-balance-ribbon">
          <span className="ribbon-label">Số dư Coin hiện tại:</span>
          <strong className="ribbon-balance">
            {Number(user.coin || 0).toLocaleString()} <span className="unit">Coin</span>
          </strong>
        </div>

        {/* Dual-column Topup Workspace */}
        <div className="topup-split-grid">
          {/* Left Column: VietQR */}
          <TopupQrCard
            activeDeposit={activeDeposit}
            bankConfig={bankConfig}
            user={user}
          />

          {/* Right Column: Amount selection or Order Details */}
          <TopupAmountSelector
            activeDeposit={activeDeposit}
            depositMultiplier={depositMultiplier}
            transferAmount={transferAmount}
            setTransferAmount={setTransferAmount}
            onCreateDeposit={handleCreateDeposit}
            onCancelDeposit={handleCancelDeposit}
            onConfirmPayment={handleConfirmPayment}
            onCopyText={handleCopyText}
            creating={creating}
            confirming={confirming}
            timeLeft={timeLeft}
            getStatusBadge={getStatusBadge}
          />
        </div>

        {/* Banking History Table */}
        <TopupHistoryTable
          history={history}
          getStatusBadge={getStatusBadge}
        />
      </div>
    </div>
  );
}
