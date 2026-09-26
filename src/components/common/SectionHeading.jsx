import React from 'react';
import { motion } from 'framer-motion';

export default function SectionHeading({
  tag = "ĐẠI HẢI TRÌNH",
  title,
  subtitle,
  centered = true,
  className = ""
}) {
  return (
    <div className={`section-header-block ${centered ? 'text-center' : ''} ${className}`}>
      {tag && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="section-badge-wrapper"
        >
          <span className="badge-pirate">
            <span className="badge-gem">⚓</span> {tag}
          </span>
        </motion.div>
      )}

      {title && (
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="section-title-cinematic"
        >
          {title}
        </motion.h2>
      )}

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="section-subtitle-cinematic"
        >
          {subtitle}
        </motion.p>
      )}

      <div className="section-divider-line">
        <span className="divider-diamond">◆</span>
      </div>
    </div>
  );
}
