import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../../api/api';

const ACTION_CONFIG = {
  ADJUST_CURRENCY: { label: 'Chỉnh sửa tiền tệ', icon: '💰', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)' },
  BUFF_TOPUP: { label: 'Buff Nạp tiền', icon: '⚡', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)' },
  ADD_COIN: { label: 'Cộng Coin trực tiếp', icon: '🪙', color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)', border: 'rgba(234, 179, 8, 0.4)' },
  DELETE_PLAYER_ITEM: { label: 'Xóa vật phẩm kho đồ', icon: '🗑️', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)' },
  RESET_USER_MILESTONES: { label: 'Reset mốc người chơi', icon: '🔄', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.4)' },
  RESET_TICHNAP: { label: 'Reset Tích Nạp Server', icon: '♻️', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.4)' },
  RESET_TICHTIEU: { label: 'Reset Tích Tiêu Server', icon: '♻️', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.4)' },
  RESET_HANGDONG: { label: 'Reset Hang Động', icon: '🏔️', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.4)' },
  RESET_PVP: { label: 'Reset Điểm PVP', icon: '⚔️', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.4)' },
  RESET_TRUYNA: { label: 'Reset Điểm Truy Nã', icon: '📜', color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)', border: 'rgba(234, 179, 8, 0.4)' },
  RESET_PHAO_HOA: { label: 'Reset Pháo Hoa', icon: '🎆', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.4)' },
  ITEM_CREATE: { label: 'Thêm vật phẩm Game', icon: '➕', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)' },
  ITEM_UPDATE: { label: 'Cập nhật vật phẩm Game', icon: '✏️', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.4)' },
  ITEM_DELETE: { label: 'Xóa vật phẩm Game', icon: '❌', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)' },
  CREATE_GIFTCODE: { label: 'Tạo Giftcode mới', icon: '🎁', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)' },
  UPDATE_GIFTCODE: { label: 'Cập nhật Giftcode', icon: '🎁', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.4)' },
  DELETE_GIFTCODE: { label: 'Xóa Giftcode', icon: '🎁', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)' },
  APPROVE_BANKING: { label: 'Duyệt đơn nạp thẻ', icon: '✅', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)' },
  REJECT_BANKING: { label: 'Từ chối đơn nạp', icon: '🚫', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)' },
  TOGGLE_RECHARGE: { label: 'Bật/Tắt nạp thẻ', icon: '🔌', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)' },
  UPDATE_MULTIPLIER: { label: 'Hệ số nhân nạp', icon: '🔥', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)', border: 'rgba(244, 63, 94, 0.4)' },
  UPDATE_USER: { label: 'Cập nhật tài khoản', icon: '👤', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.4)' },
  DELETE_USER: { label: 'Xóa tài khoản', icon: '☠️', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)' },
  BULK_DELETE_CLONE: { label: 'Xóa hàng loạt clone', icon: '🧹', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.15)', border: 'rgba(220, 38, 38, 0.4)' }
};

export default function AdminAuditLogs() {
  const { showMessage } = useOutletContext();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableActions, setAvailableActions] = useState([]);

  // Filter States
  const [actionFilter, setActionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Detail Modal State
  const [activeLogModal, setActiveLogModal] = useState(null);

  const fetchLogs = useCallback(async (currentPage = page, currentLimit = limit) => {
    setLoading(true);
    try {
      const res = await api.get('admin/audit-logs', {
        params: {
          page: currentPage,
          limit: currentLimit,
          action: actionFilter,
          search: searchQuery.trim(),
          startDate,
          endDate
        }
      });

      if (res.data && res.data.success) {
        setLogs(res.data.logs || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
        if (res.data.availableActions) {
          setAvailableActions(res.data.availableActions);
        }
      } else {
        showMessage('error', res.data?.message || 'Không thể tải nhật ký quản trị.');
      }
    } catch (err) {
      console.error('Error fetching admin audit logs:', err);
      showMessage('error', 'Lỗi kết nối máy chủ khi tải nhật ký.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, actionFilter, searchQuery, startDate, endDate, showMessage]);

  useEffect(() => {
    fetchLogs(page, limit);
  }, [fetchLogs, page, limit]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLogs(1, limit);
  };

  const handleResetFilters = () => {
    setActionFilter('all');
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch {
      return String(dateStr);
    }
  };

  const renderJsonPretty = (rawJson) => {
    if (!rawJson) return <span style={{ color: '#64748b' }}>Không có dữ liệu</span>;
    try {
      const parsed = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
      return (
        <pre style={{
          background: '#090d16',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #1e293b',
          color: '#38bdf8',
          fontSize: '12px',
          maxHeight: '260px',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          margin: 0
        }}>
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    } catch {
      return (
        <pre style={{
          background: '#090d16',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #1e293b',
          color: '#cbd5e1',
          fontSize: '12px',
          margin: 0
        }}>
          {String(rawJson)}
        </pre>
      );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '22px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{
            margin: 0,
            fontSize: '22px',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #f8fafc 0%, #38bdf8 50%, #00d2ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.4px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>🛡️</span> NHẬT KÝ QUẢN TRỊ (AUDIT LOGS)
          </h2>
          <p style={{ color: '#8294ae', margin: '6px 0 0 0', fontSize: '13.5px' }}>
            Hệ thống tự động ghi nhận minh bạch người thực hiện, thời gian, chi tiết dữ liệu trước/sau và địa chỉ IP cho mọi thao tác quản trị.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ color: '#8294ae', fontSize: '13px' }}>Tổng ghi nhận: <strong style={{ color: '#00d2ff' }}>{total.toLocaleString()}</strong> thao tác</span>
          <button
            onClick={() => fetchLogs(page, limit)}
            className="btn btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
          >
            🔄 Làm mới
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <form onSubmit={handleFilterSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Action Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: '#94a3b8' }}>Loại hành động</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="form-control"
              style={{ width: '190px', background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
            >
              <option value="all">Tất cả hành động ({availableActions.length})</option>
              {availableActions.map((act) => {
                const conf = ACTION_CONFIG[act];
                return (
                  <option key={act} value={act}>
                    {conf ? `${conf.icon} ${conf.label}` : act}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Search Query */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 200px' }}>
            <label style={{ fontSize: '12px', color: '#94a3b8' }}>Tìm kiếm (Admin, Mục tiêu, Nội dung)</label>
            <input
              type="text"
              placeholder="VD: admin, luffy, 442..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
            />
          </div>

          {/* From Date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: '#94a3b8' }}>Từ ngày</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-control"
              style={{ background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
            />
          </div>

          {/* To Date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', color: '#94a3b8' }}>Đến ngày</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-control"
              style={{ background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', marginTop: '18px' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>
              🔍 Lọc
            </button>
            <button type="button" onClick={handleResetFilters} className="btn btn-outline" style={{ padding: '8px 14px', borderColor: '#334155', color: '#94a3b8' }}>
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Logs Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            <div className="anchor-spinner" style={{ fontSize: '28px', marginBottom: '10px' }}>⚓</div>
            <p>Đang tải nhật ký quản trị từ cơ sở dữ liệu...</p>
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '50px 20px', textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: '42px', marginBottom: '12px' }}>📜</div>
            <h4 style={{ color: '#94a3b8', margin: '0 0 6px 0' }}>Không tìm thấy bản ghi nhật ký phù hợp</h4>
            <p style={{ margin: 0, fontSize: '13px' }}>Các thao tác quản trị như chỉnh sửa tiền, xóa vật phẩm, giftcode hoặc duyệt nạp sẽ tự động xuất hiện tại đây.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', textAlign: 'left' }}>
                  <th style={{ padding: '10px 8px', width: '60px' }}>ID</th>
                  <th style={{ padding: '10px 8px', width: '150px' }}>Thời gian</th>
                  <th style={{ padding: '10px 8px', width: '120px' }}>Admin</th>
                  <th style={{ padding: '10px 8px' }}>Hành động</th>
                  <th style={{ padding: '10px 8px' }}>Đối tượng</th>
                  <th style={{ padding: '10px 8px', width: '130px' }}>IP / Thiết bị</th>
                  <th style={{ padding: '10px 8px', width: '90px', textAlign: 'center' }}>Trạng thái</th>
                  <th style={{ padding: '10px 8px', width: '100px', textAlign: 'center' }}>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const actionConf = ACTION_CONFIG[log.action] || {
                    label: log.action,
                    icon: '⚙️',
                    color: '#94a3b8',
                    bg: 'rgba(148, 163, 184, 0.15)',
                    border: 'rgba(148, 163, 184, 0.35)'
                  };

                  return (
                    <tr
                      key={log.id}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '12px 8px', color: '#64748b' }}>#{log.id}</td>
                      <td style={{ padding: '12px 8px', color: '#cbd5e1', fontSize: '12px' }}>
                        {formatDateTime(log.created_at)}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: 'rgba(239, 68, 68, 0.12)',
                          color: '#f87171',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          border: '1px solid rgba(239, 68, 68, 0.25)'
                        }}>
                          🛡️ {log.admin_username}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 9px',
                          borderRadius: '6px',
                          background: actionConf.bg,
                          color: actionConf.color,
                          border: `1px solid ${actionConf.border}`,
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          <span>{actionConf.icon}</span>
                          <span>{actionConf.label}</span>
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', color: '#f1f5f9', fontWeight: '500' }}>
                        {log.target ? (
                          <span style={{ fontFamily: 'monospace', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                            {log.target}
                          </span>
                        ) : (
                          <span style={{ color: '#64748b' }}>-</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#94a3b8', fontSize: '11.5px' }}>
                        <div style={{ fontFamily: 'monospace' }}>{log.ip_address || '127.0.0.1'}</div>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          background: log.status === 'SUCCESS' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: log.status === 'SUCCESS' ? '#34d399' : '#f87171'
                        }}>
                          {log.status === 'SUCCESS' ? 'THÀNH CÔNG' : 'THẤT BẠI'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <button
                          onClick={() => setActiveLogModal(log)}
                          className="btn btn-outline"
                          style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            borderColor: 'rgba(255,255,255,0.15)',
                            color: '#38bdf8'
                          }}
                          title="Xem dữ liệu trước/sau"
                        >
                          👁️ Chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ color: '#94a3b8', fontSize: '12.5px' }}>
              Trang {page} / {totalPages} (Hiển thị {logs.length} bản ghi)
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="btn btn-outline"
                style={{ padding: '6px 12px', borderColor: '#334155', color: page <= 1 ? '#475569' : '#fff' }}
              >
                ◀ Trước
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                let p = page - 2 + idx;
                if (page < 3) p = idx + 1;
                if (p > totalPages || p < 1) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={page === p ? 'btn btn-primary' : 'btn btn-outline'}
                    style={{ padding: '6px 12px', borderColor: '#334155' }}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="btn btn-outline"
                style={{ padding: '6px 12px', borderColor: '#334155', color: page >= totalPages ? '#475569' : '#fff' }}
              >
                Sau ▶
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Log Detail Modal */}
      {activeLogModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '750px',
            background: '#090d16',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#f59e0b', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📜</span> CHI TIẾT NHẬT KÝ #{activeLogModal.id}
                </h3>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{formatDateTime(activeLogModal.created_at)}</span>
              </div>
              <button
                onClick={() => setActiveLogModal(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Meta Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Người thực hiện</div>
                <div style={{ color: '#f87171', fontWeight: 'bold' }}>🛡️ {activeLogModal.admin_username}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Hành động</div>
                <div style={{ color: '#38bdf8', fontWeight: '600' }}>{activeLogModal.action}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Đối tượng tác động</div>
                <div style={{ color: '#f1f5f9' }}>{activeLogModal.target || 'N/A'}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Địa chỉ IP</div>
                <div style={{ fontFamily: 'monospace', color: '#94a3b8' }}>{activeLogModal.ip_address || '127.0.0.1'}</div>
              </div>
            </div>

            {/* Before / After Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>⏪</span> Dữ liệu Trước khi thay đổi (Before)
                </h4>
                {renderJsonPretty(activeLogModal.details_before)}
              </div>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>⏩</span> Dữ liệu Sau khi thay đổi (After)
                </h4>
                {renderJsonPretty(activeLogModal.details_after)}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => setActiveLogModal(null)}
                className="btn btn-outline"
                style={{ padding: '8px 20px', borderColor: '#334155' }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
