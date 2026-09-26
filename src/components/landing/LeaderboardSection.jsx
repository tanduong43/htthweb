import React, { useState } from 'react';
import { CLASSES } from '../../utils/constants';
import SectionHeading from '../common/SectionHeading';

export default function LeaderboardSection({
  rankings = { topLevel: [], topPvp: [], topClan: [] },
  loading = false,
  error = null,
  onRetry
}) {
  const [activeTab, setActiveTab] = useState('level'); // 'level' | 'pvp' | 'clan'

  // Helper to get class info
  const getClassInfo = (clazzId) => {
    const cl = CLASSES.find((c) => c.id === clazzId);
    return cl || { name: 'Vô Danh', icon: '🏴‍☠️', color: '#94a3b8' };
  };

  const renderRankBadge = (idx) => {
    if (idx === 0) return <span className="rank-crest gold">👑 1</span>;
    if (idx === 1) return <span className="rank-crest silver">🥈 2</span>;
    if (idx === 2) return <span className="rank-crest bronze">🥉 3</span>;
    return <span className="rank-crest standard">{idx + 1}</span>;
  };

  return (
    <section className="leaderboard-section container-section">
      <SectionHeading
        tag="ĐẠI HẢI TRÌNH"
        title="BẢNG XẾP HẠNG ANH HÙNG"
        subtitle="Vinh danh những thuyền trưởng kiệt xuất, bách chiến bách thắng trên hải trình chinh phục ngôi vị Vua Hải Tặc."
      />

      {/* Tabs for quick filtering or mobile view */}
      <div className="leaderboard-switch-tabs">
        <button
          className={`switch-tab-btn ${activeTab === 'level' ? 'active' : ''}`}
          onClick={() => setActiveTab('level')}
        >
          <span className="tab-icon">🏆</span> TOP CẤP ĐỘ
        </button>
        <button
          className={`switch-tab-btn ${activeTab === 'pvp' ? 'active' : ''}`}
          onClick={() => setActiveTab('pvp')}
        >
          <span className="tab-icon">⚔️</span> TOP ĐẤU TRƯỜNG PVP
        </button>
        <button
          className={`switch-tab-btn ${activeTab === 'clan' ? 'active' : ''}`}
          onClick={() => setActiveTab('clan')}
        >
          <span className="tab-icon">🛡️</span> TOP BĂNG HẢI TẶC
        </button>
      </div>

      {loading ? (
        <div className="ranking-loading-state">
          <div className="anchor-spinner">⚓</div>
          <p>Đang triệu tập danh sách cao thủ Đại Hải Trình...</p>
        </div>
      ) : error ? (
        <div className="ranking-error-state">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          {onRetry && (
            <button onClick={onRetry} className="btn-retry-ranking">
              Thử lại 🔄
            </button>
          )}
        </div>
      ) : (
        <div className="leaderboards-grid-layout">
          {/* TOP LEVEL */}
          <div className={`leaderboard-box ${activeTab === 'level' ? 'tab-visible' : 'tab-hidden-mobile'}`}>
            <div className="box-header header-gold">
              <div className="header-icon">🏆</div>
              <div>
                <h3 className="box-title">TOP CAO THỦ CẤP ĐỘ</h3>
                <span className="box-sub">Bậc thầy cày cuốc & đột phá giới hạn</span>
              </div>
            </div>

            <div className="table-responsive">
              <table className="pirate-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px', textAlign: 'center' }}>Hạng</th>
                    <th>Thuyền Trưởng</th>
                    <th style={{ textAlign: 'center' }}>Hệ Phái</th>
                    <th style={{ textAlign: 'right', width: '90px' }}>Cấp Độ</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.topLevel && rankings.topLevel.length > 0 ? (
                    rankings.topLevel.map((player, idx) => {
                      const cl = getClassInfo(player.clazz);
                      return (
                        <tr key={idx} className={`rank-row row-${idx + 1}`}>
                          <td style={{ textAlign: 'center' }}>{renderRankBadge(idx)}</td>
                          <td>
                            <div className="player-cell">
                              <span className="player-name">{player.name}</span>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="class-pill" style={{ color: cl.color, borderColor: `${cl.color}40` }}>
                              <span className="cl-icon">{cl.icon}</span> {cl.name}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className="level-badge">Lv.{player.level}</span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="empty-table-msg">
                        Chưa có dữ liệu cao thủ cấp độ.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* TOP PVP */}
          <div className={`leaderboard-box ${activeTab === 'pvp' ? 'tab-visible' : 'tab-hidden-mobile'}`}>
            <div className="box-header header-crimson">
              <div className="header-icon">⚔️</div>
              <div>
                <h3 className="box-title">TOP CHIẾN THẦN PVP</h3>
                <span className="box-sub">Đấu sĩ càn quét đấu trường rực lửa</span>
              </div>
            </div>

            <div className="table-responsive">
              <table className="pirate-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px', textAlign: 'center' }}>Hạng</th>
                    <th>Thuyền Trưởng</th>
                    <th style={{ textAlign: 'center' }}>Hệ Phái</th>
                    <th style={{ textAlign: 'right', width: '110px' }}>Điểm PK</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.topPvp && rankings.topPvp.length > 0 ? (
                    rankings.topPvp.map((player, idx) => {
                      const cl = getClassInfo(player.clazz);
                      return (
                        <tr key={idx} className={`rank-row row-${idx + 1}`}>
                          <td style={{ textAlign: 'center' }}>{renderRankBadge(idx)}</td>
                          <td>
                            <div className="player-cell">
                              <span className="player-name">{player.name}</span>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="class-pill" style={{ color: cl.color, borderColor: `${cl.color}40` }}>
                              <span className="cl-icon">{cl.icon}</span> {cl.name}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className="pvp-score-badge">
                              {Number(player.pvppoint || 0).toLocaleString()} PTS
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="empty-table-msg">
                        Chưa có dữ liệu cao thủ PvP.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* TOP CLAN */}
          <div className={`leaderboard-box clan-box ${activeTab === 'clan' ? 'tab-visible' : 'tab-hidden-mobile'}`}>
            <div className="box-header header-cyan">
              <div className="header-icon">🛡️</div>
              <div>
                <h3 className="box-title">TOP BĂNG HẢI TẶC HUYỀN THOẠI</h3>
                <span className="box-sub">Các băng đảng thống trị các vùng biển lớn</span>
              </div>
            </div>

            <div className="table-responsive">
              <table className="pirate-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px', textAlign: 'center' }}>Hạng</th>
                    <th>Tên Băng Hải Tặc</th>
                    <th style={{ textAlign: 'center', width: '130px' }}>Thành Viên</th>
                    <th style={{ textAlign: 'right', width: '140px' }}>Kinh Nghiệm (XP)</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.topClan && rankings.topClan.length > 0 ? (
                    rankings.topClan.map((clan, idx) => {
                      return (
                        <tr key={idx} className={`rank-row row-${idx + 1}`}>
                          <td style={{ textAlign: 'center' }}>{renderRankBadge(idx)}</td>
                          <td>
                            <div className="clan-name-cell">
                              <span className="clan-crest">🏴‍☠️</span>
                              <span className="player-name">{clan.name}</span>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="clan-members-tag">👥 {clan.members}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <span className="clan-xp-badge">
                              {Number(clan.xp || 0).toLocaleString()} XP
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="empty-table-msg">
                        Chưa có dữ liệu băng nhóm hải tặc.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
