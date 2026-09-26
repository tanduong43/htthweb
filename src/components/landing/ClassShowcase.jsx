import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CLASSES } from '../../utils/constants';
import SectionHeading from '../common/SectionHeading';

export default function ClassShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeClass = CLASSES[activeIdx];

  return (
    <section className="class-showcase-section container-section">
      <SectionHeading
        tag="HỆ THỐNG MÔN PHÁI"
        title="NGŨ ĐẠI HẢI TẶC CHIẾN BINH"
        subtitle="Mỗi hệ phái sở hữu bộ kỹ năng và vũ khí độc môn riêng biệt. Hãy chọn con đường xưng vương của bạn!"
      />

      <div className="class-showcase-container">
        {/* Class Selection Tabs */}
        <div className="class-tabs-list">
          {CLASSES.map((cl, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={cl.id}
                onClick={() => setActiveIdx(idx)}
                className={`class-select-tab ${isActive ? 'active' : ''}`}
                style={{
                  '--accent-color': cl.color,
                  '--accent-glow': cl.accentGlow,
                }}
              >
                <div className="tab-icon-badge" style={{ backgroundColor: `${cl.color}20`, borderColor: `${cl.color}60` }}>
                  <span>{cl.icon}</span>
                </div>
                <div className="tab-text-info">
                  <div className="tab-name-row">
                    <span className="tab-class-name">{cl.name}</span>
                    <span className="tab-role-tag">{cl.role}</span>
                  </div>
                  <span className="tab-weapon-desc">Vũ khí: {cl.weapon}</span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeClassHighlight"
                    className="tab-active-indicator"
                    transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Class Detail Panel */}
        <div className="class-detail-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeClass.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="class-detail-card"
              style={{
                '--class-accent': activeClass.color,
                '--class-glow': activeClass.accentGlow,
              }}
            >
              <div className="card-top-header">
                <div className="class-avatar-halo" style={{ borderColor: activeClass.color }}>
                  <span className="avatar-icon">{activeClass.icon}</span>
                </div>
                <div className="header-meta">
                  <div className="meta-badge-row">
                    <span className="badge-role" style={{ color: activeClass.color, borderColor: `${activeClass.color}60` }}>
                      {activeClass.role}
                    </span>
                    <span className="badge-id">Class #0{activeClass.id}</span>
                  </div>
                  <h3 className="detail-class-title">{activeClass.name}</h3>
                  <div className="detail-weapon-row">
                    <span className="weapon-label">Trang bị độc môn:</span>
                    <strong className="weapon-name" style={{ color: activeClass.color }}>
                      {activeClass.weapon}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="class-lore-box">
                <p className="class-lore-text">{activeClass.description}</p>
              </div>

              {/* Stats Bars with Progress Animations */}
              <div className="class-stats-panel">
                <h4 className="stats-section-title">
                  <span>CHỈ SỐ THUỘC TÍNH CHIẾN ĐẤU</span>
                </h4>

                <div className="stats-bars-grid">
                  {/* HP */}
                  <div className="stat-item">
                    <div className="stat-label-group">
                      <span className="stat-name">❤️ Sinh Mệnh (HP)</span>
                      <span className="stat-value">{activeClass.stats.hp}%</span>
                    </div>
                    <div className="stat-track">
                      <motion.div
                        className="stat-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${activeClass.stats.hp}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        style={{ backgroundColor: activeClass.color }}
                      />
                    </div>
                  </div>

                  {/* ATK */}
                  <div className="stat-item">
                    <div className="stat-label-group">
                      <span className="stat-name">⚔️ Tấn Công (ATK)</span>
                      <span className="stat-value">{activeClass.stats.atk}%</span>
                    </div>
                    <div className="stat-track">
                      <motion.div
                        className="stat-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${activeClass.stats.atk}%` }}
                        transition={{ duration: 0.6, delay: 0.05, ease: 'easeOut' }}
                        style={{ backgroundColor: activeClass.color }}
                      />
                    </div>
                  </div>

                  {/* DEF */}
                  <div className="stat-item">
                    <div className="stat-label-group">
                      <span className="stat-name">🛡️ Phòng Ngự (DEF)</span>
                      <span className="stat-value">{activeClass.stats.def}%</span>
                    </div>
                    <div className="stat-track">
                      <motion.div
                        className="stat-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${activeClass.stats.def}%` }}
                        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                        style={{ backgroundColor: activeClass.color }}
                      />
                    </div>
                  </div>

                  {/* SPD */}
                  <div className="stat-item">
                    <div className="stat-label-group">
                      <span className="stat-name">⚡ Tốc Độ (SPD)</span>
                      <span className="stat-value">{activeClass.stats.spd}%</span>
                    </div>
                    <div className="stat-track">
                      <motion.div
                        className="stat-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${activeClass.stats.spd}%` }}
                        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                        style={{ backgroundColor: activeClass.color }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
