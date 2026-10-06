import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../../api/api';

const styles = {
  formContainer: {
    maxWidth: '420px',
    margin: '40px auto',
    padding: '30px',
    background: 'rgba(26, 26, 26, 0.6)',
    border: '1px solid #333',
    borderRadius: '16px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
    fontFamily: '"Times New Roman", Times, serif',
    color: '#fff',
    backdropFilter: 'blur(8px)',
  },
  title: {
    color: '#ff3366',
    marginBottom: '25px',
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    textAlign: 'left',
    color: '#aaa',
    fontSize: '13px'
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #444',
    backgroundColor: '#111',
    color: '#fff',
    boxSizing: 'border-box',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  btnSubmit: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#ff3366',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(255, 51, 102, 0.25)',
    transition: 'all 0.3s ease',
    marginTop: '10px'
  }
};

function AdminCoin() {
  const { showMessage } = useOutletContext();
  const [targetUser, setTargetUser] = useState('');
  const [amount, setAmount] = useState('');
  const [isDeposit, setIsDeposit] = useState(false);
  const [focusField, setFocusField] = useState('');

  const handleAddCoin = async (e) => {
    e.preventDefault();
    if (!targetUser.trim()) return showMessage('error', 'Vui lòng nhập tên tài khoản!');
    if (!amount || Number(amount) <= 0) return showMessage('error', 'Số lượng coin phải lớn hơn 0!');

    try {
      const res = await api.post('admin/add_coin/', { 
        username: targetUser.trim(), 
        amount: Number(amount),
        isDeposit 
      });
      showMessage(res.data.success ? 'success' : 'error', res.data.message);
      if (res.data.success) {
        setTargetUser('');
        setAmount('');
        setIsDeposit(false);
      }
    } catch {
      showMessage('error', 'Lỗi kết nối máy chủ!');
    }
  };

  // State quản lý Box thông báo xác nhận & kết quả Reset
  const [resetModal, setResetModal] = useState({
    isOpen: false,
    title: '',
    icon: '',
    color: '',
    warningText: '',
    actionEndpoint: '',
    loading: false,
    result: null // null | { success: boolean, message: string }
  });

  const handleOpenResetModal = (title, icon, color, warningText, actionEndpoint) => {
    setResetModal({
      isOpen: true,
      title,
      icon,
      color,
      warningText,
      actionEndpoint,
      loading: false,
      result: null
    });
  };

  const handleCloseResetModal = () => {
    if (resetModal.loading) return;
    setResetModal(prev => ({ ...prev, isOpen: false, result: null }));
  };

  const handleConfirmReset = async () => {
    if (!resetModal.actionEndpoint || resetModal.loading) return;
    setResetModal(prev => ({ ...prev, loading: true }));

    try {
      const res = await api.post(resetModal.actionEndpoint);
      showMessage(res.data.success ? 'success' : 'error', res.data.message);
      setResetModal(prev => ({
        ...prev,
        loading: false,
        result: {
          success: !!res.data.success,
          message: res.data.message || (res.data.success ? 'Thực hiện reset thành công!' : 'Thực hiện reset thất bại!')
        }
      }));
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Lỗi kết nối máy chủ khi thực hiện reset!';
      showMessage('error', errMsg);
      setResetModal(prev => ({
        ...prev,
        loading: false,
        result: {
          success: false,
          message: errMsg
        }
      }));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '30px', justifyContent: 'center', alignItems: 'flex-start', padding: '20px' }}>
      {/* Form cộng coin nhanh */}
      <form onSubmit={handleAddCoin} style={{ ...styles.formContainer, margin: '0', flex: '1 1 300px', maxWidth: '420px' }}>
        <h3 style={styles.title}>💰 CỘNG COIN NHANH</h3>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Tên tài khoản (username):</label>
          <input
            type="text"
            placeholder="Ví dụ: player1"
            value={targetUser}
            onChange={(e) => setTargetUser(e.target.value)}
            onFocus={() => setFocusField('username')}
            onBlur={() => setFocusField('')}
            required
            style={{
              ...styles.input,
              borderColor: focusField === 'username' ? '#ff3366' : '#444',
              boxShadow: focusField === 'username' ? '0 0 0 2px rgba(255, 51, 102, 0.2)' : 'none'
            }}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Số lượng Coin:</label>
          <input
            type="number"
            placeholder="Nhập số coin cần cộng"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onFocus={() => setFocusField('amount')}
            onBlur={() => setFocusField('')}
            required
            min="1"
            style={{
              ...styles.input,
              borderColor: focusField === 'amount' ? '#ff3366' : '#444',
              boxShadow: focusField === 'amount' ? '0 0 0 2px rgba(255, 51, 102, 0.2)' : 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#eee' }}>
            <input
              type="checkbox"
              checked={isDeposit}
              onChange={(e) => setIsDeposit(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#ff3366' }}
            />
            <span>⚡ Tính là Nạp tiền (Tăng Tích Nạp & VIP)</span>
          </label>
        </div>

        <button 
          type="submit" 
          style={styles.btnSubmit}
          onMouseOver={(e) => e.target.style.backgroundColor = '#e62e5c'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#ff3366'}
        >
          Xác Nhận Cộng
        </button>
      </form>

      {/* Card Reset Tích Lũy Nạp */}
      <div style={{ ...styles.formContainer, margin: '0', flex: '1 1 300px', maxWidth: '420px' }}>
        <h3 style={{ ...styles.title, color: '#faad14', background: 'linear-gradient(135deg, #faad14 0%, #ffc069 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🔄 RESET TÍCH LŨY NẠP
        </h3>
        
        <p style={{ color: '#aaa', fontSize: '13.5px', marginBottom: '22px', lineHeight: '1.6', textAlign: 'center' }}>
          Đặt lại điểm tích lũy nạp của **TẤT CẢ** tài khoản về 0 và xóa trạng thái nhận quà mốc nạp. 
          <br />
          <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>*Khuyến nghị nên làm khi bảo trì.*</span>
        </p>

        <button 
          type="button" 
          onClick={() => handleOpenResetModal(
            'RESET TÍCH LŨY NẠP',
            '🔄',
            '#faad14',
            'Đặt lại điểm tích lũy nạp của TẤT CẢ tài khoản về 0 và xóa trạng thái nhận quà mốc nạp.',
            'admin/reset_tichnap'
          )}
          style={{
            ...styles.btnSubmit,
            backgroundColor: '#faad14',
            boxShadow: '0 4px 12px rgba(250, 173, 20, 0.25)',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#d48806'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#faad14'}
        >
          Xác Nhận Reset Toàn Bộ
        </button>
      </div>

      {/* Card Reset Tích Lũy Tiêu */}
      <div style={{ ...styles.formContainer, margin: '0', flex: '1 1 300px', maxWidth: '420px' }}>
        <h3 style={{ ...styles.title, color: '#13c2c2', background: 'linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🔄 RESET TÍCH TIÊU RUBY
        </h3>
        
        <p style={{ color: '#aaa', fontSize: '13.5px', marginBottom: '22px', lineHeight: '1.6', textAlign: 'center' }}>
          Đặt lại điểm tích tiêu ruby của **TẤT CẢ** nhân vật về 0 và xóa trạng thái nhận quà mốc tiêu. 
          <br />
          <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>*Khuyến nghị nên làm khi bảo trì.*</span>
        </p>

        <button 
          type="button" 
          onClick={() => handleOpenResetModal(
            'RESET TÍCH TIÊU RUBY',
            '🔄',
            '#13c2c2',
            'Đặt lại điểm tích tiêu ruby của TẤT CẢ nhân vật về 0 và xóa trạng thái nhận quà mốc tiêu.',
            'admin/reset_tichtieu'
          )}
          style={{
            ...styles.btnSubmit,
            backgroundColor: '#13c2c2',
            boxShadow: '0 4px 12px rgba(19, 194, 194, 0.25)',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#08979c'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#13c2c2'}
        >
          Xác Nhận Reset Toàn Bộ
        </button>
      </div>

      {/* Card Reset Hang Động */}
      <div style={{ ...styles.formContainer, margin: '0', flex: '1 1 300px', maxWidth: '420px' }}>
        <h3 style={{ ...styles.title, color: '#9254de', background: 'linear-gradient(135deg, #9254de 0%, #b37feb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🔄 RESET HANG ĐỘNG
        </h3>
        
        <p style={{ color: '#aaa', fontSize: '13.5px', marginBottom: '22px', lineHeight: '1.6', textAlign: 'center' }}>
          Đặt lại tiến trình tầng Hang Động của **TẤT CẢ** nhân vật về 0. 
          <br />
          <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>*Khuyến nghị nên làm khi bảo trì.*</span>
        </p>

        <button 
          type="button" 
          onClick={() => handleOpenResetModal(
            'RESET TIẾN TRÌNH HANG ĐỘNG',
            '🔄',
            '#9254de',
            'Đặt lại tiến trình tầng Hang Động của TẤT CẢ nhân vật về 0.',
            'admin/reset_hangdong'
          )}
          style={{
            ...styles.btnSubmit,
            backgroundColor: '#9254de',
            boxShadow: '0 4px 12px rgba(146, 84, 222, 0.25)',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#722ed1'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#9254de'}
        >
          Xác Nhận Reset Toàn Bộ
        </button>
      </div>

      {/* Card Reset Điểm PVP */}
      <div style={{ ...styles.formContainer, margin: '0', flex: '1 1 300px', maxWidth: '420px' }}>
        <h3 style={{ ...styles.title, color: '#fa541c', background: 'linear-gradient(135deg, #fa541c 0%, #ff7a45 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ⚔️ RESET ĐIỂM PVP
        </h3>
        
        <p style={{ color: '#aaa', fontSize: '13.5px', marginBottom: '22px', lineHeight: '1.6', textAlign: 'center' }}>
          Đặt lại điểm PVP của **TẤT CẢ** nhân vật về 0 (giữ nguyên số trận thắng/thua). 
          <br />
          <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>*Khuyến nghị nên làm khi bảo trì.*</span>
        </p>

        <button 
          type="button" 
          onClick={() => handleOpenResetModal(
            'RESET ĐIỂM PVP',
            '⚔️',
            '#fa541c',
            'Đặt lại điểm PVP của TẤT CẢ nhân vật về 0 (giữ nguyên số trận thắng/thua).',
            'admin/reset_pvp'
          )}
          style={{
            ...styles.btnSubmit,
            backgroundColor: '#fa541c',
            boxShadow: '0 4px 12px rgba(250, 84, 28, 0.25)',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#d4380d'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#fa541c'}
        >
          Xác Nhận Reset Toàn Bộ
        </button>
      </div>

      {/* Card Reset Điểm Truy Nã */}
      <div style={{ ...styles.formContainer, margin: '0', flex: '1 1 300px', maxWidth: '420px' }}>
        <h3 style={{ ...styles.title, color: '#eb2f96', background: 'linear-gradient(135deg, #eb2f96 0%, #f759ab 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          📜 RESET ĐIỂM TRUY NÃ
        </h3>
        
        <p style={{ color: '#aaa', fontSize: '13.5px', marginBottom: '22px', lineHeight: '1.6', textAlign: 'center' }}>
          Đặt lại điểm truy nã (bounty / tiền thưởng hải tặc) của **TẤT CẢ** nhân vật về 0. 
          <br />
          <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>*Khuyến nghị nên làm khi bảo trì.*</span>
        </p>

        <button 
          type="button" 
          onClick={() => handleOpenResetModal(
            'RESET ĐIỂM TRUY NÃ',
            '📜',
            '#eb2f96',
            'Đặt lại điểm truy nã (bounty / tiền thưởng hải tặc) của TẤT CẢ nhân vật về 0.',
            'admin/reset_truyna'
          )}
          style={{
            ...styles.btnSubmit,
            backgroundColor: '#eb2f96',
            boxShadow: '0 4px 12px rgba(235, 47, 150, 0.25)',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#c41d7f'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#eb2f96'}
        >
          Xác Nhận Reset Toàn Bộ
        </button>
      </div>

      {/* Card Reset Top Pháo Hoa */}
      <div style={{ ...styles.formContainer, margin: '0', flex: '1 1 300px', maxWidth: '420px' }}>
        <h3 style={{ ...styles.title, color: '#ff4d4f', background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🎆 RESET TOP PHÁO HOA
        </h3>
        
        <p style={{ color: '#aaa', fontSize: '13.5px', marginBottom: '22px', lineHeight: '1.6', textAlign: 'center' }}>
          Đặt lại số lượng Pháo Hoa đã bắn của **TẤT CẢ** nhân vật về 0 để làm mới Bảng Xếp Hạng Đua Top Pháo Hoa. 
          <br />
          <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>*Khuyến nghị nên làm khi bảo trì.*</span>
        </p>

        <button 
          type="button" 
          onClick={() => handleOpenResetModal(
            'RESET TOP PHÁO HOA',
            '🎆',
            '#ff4d4f',
            'Đặt lại toàn bộ số lượng Pháo Hoa đã bắn của TẤT CẢ nhân vật về 0 để làm mới Bảng Xếp Hạng Đua Top Pháo Hoa.',
            'admin/reset_phaohoa'
          )}
          style={{
            ...styles.btnSubmit,
            backgroundColor: '#ff4d4f',
            boxShadow: '0 4px 12px rgba(255, 77, 79, 0.25)',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#cf1322'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#ff4d4f'}
        >
          Xác Nhận Reset Toàn Bộ
        </button>
      </div>

      {/* MODAL / BOX THÔNG BÁO XÁC NHẬN & KẾT QUẢ RESET */}
      {resetModal.isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(6px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={handleCloseResetModal}
        >
          <div
            style={{
              background: 'linear-gradient(145deg, #181c24 0%, #11141a 100%)',
              border: `1px solid ${
                resetModal.result
                  ? resetModal.result.success
                    ? 'rgba(82, 196, 26, 0.5)'
                    : 'rgba(255, 77, 79, 0.5)'
                  : resetModal.color
                  ? resetModal.color + '60'
                  : 'rgba(255, 51, 102, 0.5)'
              }`,
              borderRadius: '16px',
              width: '100%',
              maxWidth: '460px',
              padding: '28px 24px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
              color: '#fff',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nếu đang ở bước xác nhận (chưa có kết quả) */}
            {!resetModal.result ? (
              <>
                <div style={{ fontSize: '46px', marginBottom: '12px' }}>
                  {resetModal.icon || '⚠️'}
                </div>
                <h3
                  style={{
                    color: resetModal.color || '#ff4d4f',
                    margin: '0 0 16px 0',
                    fontSize: '18px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {resetModal.title}
                </h3>

                <div
                  style={{
                    background: 'rgba(255, 77, 79, 0.08)',
                    border: '1px solid rgba(255, 77, 79, 0.25)',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    marginBottom: '22px',
                    textAlign: 'left',
                    fontSize: '13.5px',
                    lineHeight: '1.6',
                    color: '#e2e8f0'
                  }}
                >
                  <div
                    style={{
                      color: '#ff7875',
                      fontWeight: '700',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>⚠️ CẢNH BÁO CỰC KỲ QUAN TRỌNG:</span>
                  </div>
                  <div>{resetModal.warningText}</div>
                  <div style={{ marginTop: '8px', color: '#ff4d4f', fontSize: '12px', fontWeight: 'bold' }}>
                    * Thao tác sẽ áp dụng cho TOÀN BỘ dữ liệu và không thể hoàn tác!
                  </div>
                  <div style={{ color: '#aaa', fontSize: '12px', marginTop: '2px' }}>
                    * Khuyến nghị nên thực hiện khi server đang bảo trì.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    disabled={resetModal.loading}
                    onClick={handleCloseResetModal}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#2d3748',
                      color: '#cbd5e1',
                      border: '1px solid #4a5568',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: resetModal.loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      if (!resetModal.loading) e.target.style.background = '#374151';
                    }}
                    onMouseOut={(e) => {
                      if (!resetModal.loading) e.target.style.background = '#2d3748';
                    }}
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="button"
                    disabled={resetModal.loading}
                    onClick={handleConfirmReset}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: resetModal.color || '#ff4d4f',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '14px',
                      cursor: resetModal.loading ? 'not-allowed' : 'pointer',
                      boxShadow: `0 4px 14px ${resetModal.color ? resetModal.color + '40' : 'rgba(255, 77, 79, 0.4)'}`,
                      opacity: resetModal.loading ? 0.7 : 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    {resetModal.loading ? '⏳ Đang Xử Lý...' : 'Xác Nhận Reset'}
                  </button>
                </div>
              </>
            ) : (
              /* Bước hiển thị kết quả xử lý */
              <>
                <div style={{ fontSize: '50px', marginBottom: '14px' }}>
                  {resetModal.result.success ? '✅' : '❌'}
                </div>
                <h3
                  style={{
                    color: resetModal.result.success ? '#52c41a' : '#ff4d4f',
                    margin: '0 0 12px 0',
                    fontSize: '19px',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}
                >
                  {resetModal.result.success ? 'RESET THÀNH CÔNG' : 'RESET THẤT BẠI'}
                </h3>

                <p
                  style={{
                    color: '#e2e8f0',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    marginBottom: '24px',
                    padding: '0 10px'
                  }}
                >
                  {resetModal.result.message}
                </p>

                <button
                  type="button"
                  onClick={handleCloseResetModal}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: resetModal.result.success ? '#52c41a' : '#ff4d4f',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '15px',
                    cursor: 'pointer',
                    boxShadow: resetModal.result.success
                      ? '0 4px 14px rgba(82, 196, 26, 0.35)'
                      : '0 4px 14px rgba(255, 77, 79, 0.35)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.filter = 'brightness(1.1)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.filter = 'none';
                  }}
                >
                  Đã Hiểu / Đóng
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCoin;
