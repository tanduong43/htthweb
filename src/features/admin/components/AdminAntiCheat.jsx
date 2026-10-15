import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../../../api/api';

const SEVERITY_CONFIG = {
  CRITICAL: {
    label: 'Cực Kỳ Nguy Hiểm',
    icon: '🚨',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.5)'
  },
  HIGH: {
    label: 'Rủi Ro Cao',
    icon: '⚠️',
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.15)',
    border: 'rgba(249, 115, 22, 0.5)'
  },
  MEDIUM: {
    label: 'Cần Theo Dõi',
    icon: '🔍',
    color: '#eab308',
    bg: 'rgba(234, 179, 8, 0.15)',
    border: 'rgba(234, 179, 8, 0.5)'
  }
};

const TYPE_CONFIG = {
  RUBY_ANOMALY: { label: 'Bất Thường Ruby', icon: '💎', color: '#ff3366' },
  BERI_ANOMALY: { label: 'Bất Thường Beri', icon: '🪙', color: '#f59e0b' },
  EQUIPMENT_DUPE: { label: 'Nhân Bản Trang Bị (Dupe)', icon: '⚔️', color: '#8b5cf6' },
  STACK_ANOMALY: { label: 'Stack Vật Phẩm Vượt Ngưỡng', icon: '📦', color: '#06b6d4' },
  MULE_ACCOUNT: { label: 'Clone/Mule Giữ Tài Sản', icon: '👤', color: '#ec4899' }
};

export default function AdminAntiCheat() {
  const { showMessage } = useOutletContext();
  const showMessageRef = useRef(showMessage);
  showMessageRef.current = showMessage;
  const hasInitialScanRef = useRef(false);

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [whitelist, setWhitelist] = useState([]);
  const [activeTab, setActiveTab] = useState('anomalies'); // 'anomalies' | 'whitelist'

  // Filter States
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Detail State
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);

  // Modal Action Confirm State
  const [actionTarget, setActionTarget] = useState(null); // { action, targetName, anomalyId, title, reason }
  const [actionLoading, setActionLoading] = useState(false);
  const [customReason, setCustomReason] = useState('');

  // Tải dữ liệu quét từ Backend (Có chống spam & cache)
  const handleRunScan = useCallback(async (isManual = false) => {
    setLoading(true);
    try {
      const res = await api.get('admin/anti-cheat/scan', {
        params: { force: isManual ? 'true' : 'false' }
      });
      if (res.data && res.data.success) {
        setSummary(res.data.summary);
        setAnomalies(res.data.anomalies || []);
        if (isManual) {
          showMessageRef.current('success', `Đã quét xong ${res.data.summary.scannedPlayersCount} nhân vật! Phát hiện ${res.data.summary.totalAnomalies} cảnh báo.`);
        }
      } else {
        showMessageRef.current('error', res.data?.message || 'Không thể quét dữ liệu hệ thống.');
      }
    } catch (err) {
      console.error('Anti-cheat scan error:', err);
      showMessageRef.current('error', 'Lỗi kết nối máy chủ khi thực hiện quét gian lận.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Tải danh sách Whitelist
  const fetchWhitelist = useCallback(async () => {
    try {
      const res = await api.get('admin/anti-cheat/whitelist');
      if (res.data && res.data.success) {
        setWhitelist(res.data.whitelist || []);
      }
    } catch (err) {
      console.error('Fetch whitelist error:', err);
    }
  }, []);

  useEffect(() => {
    if (!hasInitialScanRef.current) {
      hasInitialScanRef.current = true;
      handleRunScan(false);
      fetchWhitelist();
    }
  }, [handleRunScan, fetchWhitelist]);

  // Xử lý thực hiện hành động (Khóa tài khoản, reset ruby, thêm whitelist)
  const handleExecuteAction = async () => {
    if (!actionTarget) return;
    setActionLoading(true);
    try {
      const res = await api.post('admin/anti-cheat/action', {
        action: actionTarget.action,
        targetName: actionTarget.targetName,
        anomalyId: actionTarget.anomalyId,
        reason: customReason || actionTarget.reason
      });

      if (res.data && res.data.success) {
        showMessage('success', res.data.message);
        setActionTarget(null);
        setSelectedAnomaly(null);
        setCustomReason('');
        // Quét lại để cập nhật trạng thái
        handleRunScan(true);
        fetchWhitelist();
      } else {
        showMessageRef.current('error', res.data?.message || 'Không thể thực hiện hành động.');
      }
    } catch (err) {
      console.error('Action error:', err);
      showMessageRef.current('error', 'Lỗi kết nối máy chủ khi thực hiện hành động.');
    } finally {
      setActionLoading(false);
    }
  };

  // Xóa khỏi Whitelist
  const handleDeleteWhitelist = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa mục này khỏi danh sách ngoại lệ?')) return;
    try {
      const res = await api.delete(`admin/anti-cheat/whitelist/${id}`);
      if (res.data && res.data.success) {
        showMessageRef.current('success', res.data.message);
        fetchWhitelist();
        handleRunScan(true);
      }
    } catch (err) {
      console.error('Delete whitelist error:', err);
      showMessage('error', 'Không thể xóa mục khỏi danh sách ngoại lệ.');
    }
  };

  // Lọc danh sách bất thường
  const filteredAnomalies = useMemo(() => {
    return anomalies.filter(a => {
      if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
      if (filterType !== 'ALL' && a.type !== filterType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchPlayer = (a.playerName || '').toLowerCase().includes(q);
        const matchAccount = (a.accountUser || '').toLowerCase().includes(q);
        const matchTitle = (a.title || '').toLowerCase().includes(q);
        if (!matchPlayer && !matchAccount && !matchTitle) return false;
      }
      return true;
    });
  }, [anomalies, filterSeverity, filterType, searchQuery]);

  return (
    <div className="admin-content-inner" style={{ padding: '24px 28px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        background: 'rgba(17, 29, 56, 0.75)',
        backdropFilter: 'blur(12px)',
        padding: '24px 28px',
        borderRadius: '14px',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        boxShadow: '0 8px 24px -4px rgba(2, 6, 23, 0.5)',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px' }}>🛡️</span>
            <h1 style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #f8fafc 0%, #38bdf8 50%, #00d2ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.4px'
            }}>
              RADAR CHỐNG HACK & PHÁT HIỆN BẤT THƯỜNG
            </h1>
            <span style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '11.5px',
              fontWeight: 700
            }}>
              Anti-Cheat Engine 2.0
            </span>
          </div>
          <p style={{ margin: 0, color: '#8294ae', fontSize: '13.5px' }}>
            Tự động đối soát dòng tiền Ruby/Beri vs Tổng nạp, quét chữ ký nhân bản trang bị (Dupe), và phát hiện tích trữ kho đồ bất thường.
          </p>
          {summary?.scannedAt && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#51637d' }}>
              🕒 Quét gần nhất: <strong style={{ color: '#cbd5e1' }}>{new Date(summary.scannedAt).toLocaleString('vi-VN')}</strong> ({summary.scannedPlayersCount} nhân vật được kiểm tra)
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setActiveTab(activeTab === 'anomalies' ? 'whitelist' : 'anomalies')}
            style={{
              padding: '11px 18px',
              borderRadius: '8px',
              background: activeTab === 'whitelist' ? 'linear-gradient(135deg, #0284c7 0%, #00d2ff 100%)' : 'rgba(255, 255, 255, 0.04)',
              border: activeTab === 'whitelist' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
              color: activeTab === 'whitelist' ? '#06101e' : '#cbd5e1',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'whitelist' ? '0 2px 10px rgba(0, 210, 255, 0.3)' : 'none'
            }}
          >
            📋 {activeTab === 'whitelist' ? 'Xem Danh Sách Cảnh Báo' : `Ngoại Lệ (${whitelist.length})`}
          </button>

          <button
            onClick={() => handleRunScan(true)}
            disabled={loading}
            style={{
              padding: '12px 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
              border: '1px solid rgba(239, 68, 68, 0.6)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
              opacity: loading ? 0.7 : 1
            }}
          >
            <span style={{ display: 'inline-block', transform: loading ? 'rotate(360deg)' : 'none', transition: 'all 0.5s' }}>
              ⚡
            </span>
            {loading ? 'Đang Quét Toàn Hệ Thống...' : 'Quét Toàn Bộ Database'}
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      {summary && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          {/* Card 1: Critical */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '14px',
            padding: '18px 20px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#fca5a5' }}>CỰC KỲ NGUY HIỂM</span>
              <span style={{ fontSize: '20px' }}>🚨</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#ef4444', marginTop: '8px' }}>
              {summary.criticalCount}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Cần xử lý khẩn cấp</div>
          </div>

          {/* Card 2: High */}
          <div style={{
            background: 'rgba(249, 115, 22, 0.08)',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            borderRadius: '14px',
            padding: '18px 20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#fdba74' }}>RỦI RO CAO</span>
              <span style={{ fontSize: '20px' }}>⚠️</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#f97316', marginTop: '8px' }}>
              {summary.highCount}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Đáng ngờ vượt hạn mức</div>
          </div>

          {/* Card 3: Ruby Anomalies */}
          <div style={{
            background: 'rgba(255, 51, 102, 0.08)',
            border: '1px solid rgba(255, 51, 102, 0.3)',
            borderRadius: '14px',
            padding: '18px 20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#fda4af' }}>BẤT THƯỜNG RUBY</span>
              <span style={{ fontSize: '20px' }}>💎</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#ff3366', marginTop: '8px' }}>
              {summary.rubyAnomalies}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Nạp 0đ / Lệch dòng tiền</div>
          </div>

          {/* Card 4: Equipment Dupes */}
          <div style={{
            background: 'rgba(139, 92, 246, 0.08)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '14px',
            padding: '18px 20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#d8b4fe' }}>DUPE TRANG BỊ</span>
              <span style={{ fontSize: '20px' }}>⚔️</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#a855f7', marginTop: '8px' }}>
              {summary.equipmentDupes}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Trùng chữ ký options</div>
          </div>

          {/* Card 5: Stack Anomalies */}
          <div style={{
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '14px',
            padding: '18px 20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#67e8f9' }}>STACK VẬT PHẨM</span>
              <span style={{ fontSize: '20px' }}>📦</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#06b6d4', marginTop: '8px' }}>
              {summary.stackAnomalies}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Tích trữ rương / đá quý</div>
          </div>
        </div>
      )}

      {/* Main Tab 1: Anomalies Radar */}
      {activeTab === 'anomalies' && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden'
        }}>
          {/* Filter Bar */}
          <div style={{
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            background: 'rgba(10, 15, 28, 0.6)'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
              {/* Filter Severity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Mức độ:</span>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    color: '#f8fafc',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}
                >
                  <option value="ALL">Tất cả mức độ</option>
                  <option value="CRITICAL">🚨 Cực kỳ nguy hiểm</option>
                  <option value="HIGH">⚠️ Rủi ro cao</option>
                  <option value="MEDIUM">🔍 Cần theo dõi</option>
                </select>
              </div>

              {/* Filter Type */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Loại vi phạm:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    color: '#f8fafc',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}
                >
                  <option value="ALL">Tất cả loại vi phạm</option>
                  <option value="RUBY_ANOMALY">💎 Bất thường Ruby</option>
                  <option value="BERI_ANOMALY">🪙 Bất thường Beri</option>
                  <option value="EQUIPMENT_DUPE">⚔️ Nhân bản Trang bị (Dupe)</option>
                  <option value="STACK_ANOMALY">📦 Stack vật phẩm vượt ngưỡng</option>
                  <option value="MULE_ACCOUNT">👤 Clone/Mule giữ đồ</option>
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div style={{ minWidth: '280px' }}>
              <input
                type="text"
                placeholder="Tìm nhân vật, tài khoản..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  color: '#f8fafc',
                  padding: '9px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Table of Anomalies */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ background: 'rgba(15, 23, 42, 0.9)', color: '#94a3b8', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <th style={{ padding: '14px 20px', width: '160px' }}>Mức Độ & Loại</th>
                  <th style={{ padding: '14px 18px', width: '220px' }}>Đối Tượng</th>
                  <th style={{ padding: '14px 20px' }}>Chi Tiết & Bằng Chứng Bất Thường</th>
                  <th style={{ padding: '14px 16px', width: '130px', textAlign: 'center' }}>Điểm Rủi Ro</th>
                  <th style={{ padding: '14px 20px', width: '210px', textAlign: 'right' }}>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnomalies.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
                      <div style={{ fontSize: '36px', marginBottom: '10px' }}>✅</div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#94a3b8' }}>
                        {loading ? 'Đang rà soát toàn bộ database...' : 'Không phát hiện trường hợp gian lận nào phù hợp bộ lọc!'}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAnomalies.map((item) => {
                    const sev = SEVERITY_CONFIG[item.severity] || SEVERITY_CONFIG.MEDIUM;
                    const typ = TYPE_CONFIG[item.type] || { label: item.type, icon: '⚠️', color: '#cbd5e1' };

                    return (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                          transition: 'background 0.2s',
                          background: item.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.03)' : 'transparent'
                        }}
                      >
                        {/* Cột 1: Mức độ & Loại */}
                        <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                              background: sev.bg,
                              color: sev.color,
                              border: `1px solid ${sev.border}`,
                              width: 'fit-content'
                            }}>
                              {sev.icon} {sev.label}
                            </span>
                            <span style={{ fontSize: '12px', color: typ.color, fontWeight: 600 }}>
                              {typ.icon} {typ.label}
                            </span>
                          </div>
                        </td>

                        {/* Cột 2: Đối tượng */}
                        <td style={{ padding: '16px 18px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '14px' }}>
                            {item.playerName}
                          </div>
                          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                            Tài khoản: <strong style={{ color: '#cbd5e1' }}>{item.accountUser}</strong>
                          </div>
                          {item.playerLevel && (
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                              Cấp độ: Lv.{item.playerLevel} {item.isLocked && <span style={{ color: '#ef4444' }}>(Đang Khóa)</span>}
                            </div>
                          )}
                        </td>

                        {/* Cột 3: Chi tiết */}
                        <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>
                            {item.title}
                          </div>
                          <div style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5' }}>
                            {item.description}
                          </div>
                          {/* Mini Evidence Badges */}
                          {item.evidence && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                              {item.evidence.currentRuby !== undefined && (
                                <span style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', color: '#ff3366' }}>
                                  💎 Hiện có: {Number(item.evidence.currentRuby).toLocaleString()} RB
                                </span>
                              )}
                              {item.evidence.totalTopupVnd !== undefined && (
                                <span style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', color: '#10b981' }}>
                                  💳 Đã nạp: {Number(item.evidence.totalTopupVnd).toLocaleString()}đ
                                </span>
                              )}
                              {item.evidence.duplicateCount !== undefined && (
                                <span style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', color: '#a855f7' }}>
                                  ⚔️ Số bản sao: {item.evidence.duplicateCount} món
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Cột 4: Điểm rủi ro */}
                        <td style={{ padding: '16px 16px', textAlign: 'center', verticalAlign: 'top' }}>
                          <div style={{
                            display: 'inline-flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <span style={{ fontSize: '18px', fontWeight: 800, color: sev.color }}>
                              {item.riskScore}
                            </span>
                            <div style={{
                              width: '60px',
                              height: '5px',
                              background: '#334155',
                              borderRadius: '3px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${item.riskScore}%`,
                                height: '100%',
                                background: sev.color,
                                borderRadius: '3px'
                              }} />
                            </div>
                          </div>
                        </td>

                        {/* Cột 5: Hành động */}
                        <td style={{ padding: '16px 20px', textAlign: 'right', verticalAlign: 'top' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                            <button
                              onClick={() => setSelectedAnomaly(item)}
                              style={{
                                padding: '5px 12px',
                                borderRadius: '6px',
                                background: '#1e293b',
                                border: '1px solid #334155',
                                color: '#f8fafc',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              🔍 Xem Bằng Chứng
                            </button>

                            <div style={{ display: 'flex', gap: '6px' }}>
                              {item.type === 'RUBY_ANOMALY' && (
                                <button
                                  onClick={() => setActionTarget({
                                    action: 'reset_ruby',
                                    targetName: item.playerName,
                                    anomalyId: item.id,
                                    title: 'Thu hồi Ruby gian lận',
                                    reason: `Thu hồi ${Number(item.evidence?.currentRuby || 0).toLocaleString()} Ruby gian lận về 500 Ruby cơ bản.`
                                  })}
                                  title="Tịch thu toàn bộ Ruby về 500"
                                  style={{
                                    padding: '5px 8px',
                                    borderRadius: '6px',
                                    background: 'rgba(255, 51, 102, 0.15)',
                                    border: '1px solid rgba(255, 51, 102, 0.4)',
                                    color: '#ff3366',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                >
                                  💎 Tịch thu RB
                                </button>
                              )}

                              {!item.isLocked && (
                                <button
                                  onClick={() => setActionTarget({
                                    action: 'lock_account',
                                    targetName: item.playerName,
                                    anomalyId: item.id,
                                    title: 'Khóa tài khoản nghi vấn',
                                    reason: `Khóa tài khoản do vi phạm: ${item.title}`
                                  })}
                                  title="Khóa tài khoản đăng nhập"
                                  style={{
                                    padding: '5px 8px',
                                    borderRadius: '6px',
                                    background: 'rgba(239, 68, 68, 0.15)',
                                    border: '1px solid rgba(239, 68, 68, 0.4)',
                                    color: '#ef4444',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                >
                                  🔒 Khóa Acc
                                </button>
                              )}

                              <button
                                onClick={() => setActionTarget({
                                  action: 'whitelist',
                                  targetName: item.playerName,
                                  anomalyId: item.id,
                                  title: 'Đưa vào danh sách ngoại lệ',
                                  reason: 'Tài khoản thử nghiệm hoặc được cấp quyền hợp lệ.'
                                })}
                                title="Bỏ qua và không cảnh báo lại"
                                style={{
                                  padding: '5px 8px',
                                  borderRadius: '6px',
                                  background: 'rgba(59, 130, 246, 0.15)',
                                  border: '1px solid rgba(59, 130, 246, 0.4)',
                                  color: '#60a5fa',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                🛡️ Ngoại lệ
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Tab 2: Whitelist Management */}
      {activeTab === 'whitelist' && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          padding: '24px'
        }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#f8fafc' }}>
            Danh Sách Nhân Vật Ngoại Lệ (Whitelist)
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>
            Các nhân vật trong danh sách này sẽ được hệ thống bỏ qua và không phát cảnh báo gian lận (thích hợp cho tài khoản test của BQT).
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ background: '#1e293b', color: '#94a3b8' }}>
                <th style={{ padding: '12px 16px' }}>Tên Nhân Vật</th>
                <th style={{ padding: '12px 16px' }}>Quy Tắc Bỏ Qua</th>
                <th style={{ padding: '12px 16px' }}>Lý Do</th>
                <th style={{ padding: '12px 16px' }}>Admin Duyệt</th>
                <th style={{ padding: '12px 16px' }}>Thời Gian</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {whitelist.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                    Chưa có nhân vật nào trong danh sách ngoại lệ.
                  </td>
                </tr>
              ) : (
                whitelist.map((w) => (
                  <tr key={w.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#f8fafc' }}>{w.target_name}</td>
                    <td style={{ padding: '12px 16px', color: '#38bdf8' }}>{w.rule_type}</td>
                    <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>{w.reason || 'Không ghi chú'}</td>
                    <td style={{ padding: '12px 16px', color: '#f59e0b' }}>{w.admin_username}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{new Date(w.created_at).toLocaleString('vi-VN')}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteWhitelist(w.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          color: '#ef4444',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Xóa Ngoại Lệ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal 1: Chi tiết Bằng Chứng (Detail Modal) */}
      {selectedAnomaly && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '700px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#f8fafc', fontWeight: 700 }}>
                  🔍 BẰNG CHỨNG GIAN LẬN: {selectedAnomaly.title}
                </h3>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                  Nhân vật: <strong style={{ color: '#f1f5f9' }}>{selectedAnomaly.playerName}</strong> (Tài khoản: {selectedAnomaly.accountUser})
                </div>
              </div>
              <button
                onClick={() => setSelectedAnomaly(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '22px',
                  cursor: 'pointer',
                  padding: '4px 8px'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {/* Box Tóm tắt */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '16px',
                borderRadius: '10px',
                color: '#fca5a5',
                fontSize: '14px',
                lineHeight: '1.6',
                marginBottom: '20px'
              }}>
                <strong>Mô tả sự vụ:</strong> {selectedAnomaly.description}
              </div>

              {/* Chi tiết Evidence */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#cbd5e1' }}>Dữ Liệu Bằng Chứng Đối Soát:</h4>
                <pre style={{
                  background: '#040711',
                  border: '1px solid #1e293b',
                  borderRadius: '10px',
                  padding: '16px',
                  fontSize: '12.5px',
                  color: '#38bdf8',
                  overflowX: 'auto',
                  fontFamily: 'Consolas, monospace'
                }}>
                  {JSON.stringify(selectedAnomaly.evidence, null, 2)}
                </pre>
              </div>

              {/* Khuyến nghị */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                padding: '14px 16px',
                borderRadius: '10px',
                color: '#93c5fd',
                fontSize: '13px'
              }}>
                💡 <strong>Khuyến nghị BQT:</strong> {selectedAnomaly.recommendation}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => setSelectedAnomaly(null)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  background: '#334155',
                  border: 'none',
                  color: '#cbd5e1',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Xác nhận Thao tác Xử lý (Confirm Action Modal) */}
      {actionTarget && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '520px',
            padding: '24px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#ef4444', fontWeight: 800 }}>
              ⚠️ XÁC NHẬN THAO TÁC: {actionTarget.title}
            </h3>
            <p style={{ margin: '0 0 16px 0', color: '#cbd5e1', fontSize: '14px', lineHeight: '1.5' }}>
              Đối tượng áp dụng: <strong style={{ color: '#f8fafc' }}>{actionTarget.targetName}</strong>
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
                Lý do thực hiện (Sẽ được ghi lại trong Nhật Ký Quản Trị):
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder={actionTarget.reason}
                rows={3}
                style={{
                  width: '100%',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  color: '#f8fafc',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setActionTarget(null)}
                disabled={actionLoading}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  background: '#334155',
                  border: 'none',
                  color: '#cbd5e1',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Hủy bỏ
              </button>

              <button
                onClick={handleExecuteAction}
                disabled={actionLoading}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  opacity: actionLoading ? 0.7 : 1
                }}
              >
                {actionLoading ? 'Đang Xử Lý...' : 'Xác Nhận Thực Hiện'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
