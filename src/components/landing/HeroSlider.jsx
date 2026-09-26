import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BANNERS } from '../../utils/constants';

export default function HeroSlider() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  // Auto Slider every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const handleNextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  };

  const handlePrevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const handleSlideAction = (action) => {
    if (action === 'account') {
      navigate('/tai-khoan');
    } else if (action === 'download') {
      const el = document.getElementById('download');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeBanner = BANNERS[currentSlide];

  // Motion variants for slide transition
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.35 },
      },
    },
    exit: (dir) => ({
      x: dir < 0 ? 50 : -50,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
      },
    }),
  };

  return (
    <section className="hero-slider-section">
      {/* Ambient Blurred Colored Atmosphere */}
      <div
        className="hero-ambient-bg"
        style={{ backgroundImage: `url(${activeBanner.image})` }}
      />
      <div className="hero-dark-scrim" />

      <div className="hero-slider-viewport">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="hero-slide-stage"
          >
            <div className="hero-layout-grid">
              {/* Left Column: Text & CTAs */}
              <div className="hero-text-col">
                <div className="hero-badge-row">
                  <span className="hero-badge">
                    <span className="badge-spark">⚔️</span> {activeBanner.subtitle}
                  </span>
                  <span className="hero-status-pill">{activeBanner.badge}</span>
                </div>

                <h1 className="hero-title">{activeBanner.title}</h1>

                <p className="hero-description">{activeBanner.description}</p>

                <div className="hero-actions-group">
                  <button
                    onClick={() => handleSlideAction(activeBanner.action)}
                    className="hero-btn-primary"
                  >
                    <span className="btn-shine"></span>
                    <span className="btn-content">{activeBanner.buttonText}</span>
                  </button>

                  <button
                    onClick={() => {
                      const el = document.getElementById('download');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hero-btn-secondary"
                  >
                    <span className="btn-content">⚡ TẢI GAME NGAY</span>
                  </button>
                </div>

                <div className="hero-platform-specs">
                  <span className="spec-label">HỖ TRỢ:</span>
                  <span className="spec-item">💻 PC Windows</span>
                  <span className="spec-dot">•</span>
                  <span className="spec-item">📱 Android APK</span>
                  <span className="spec-dot">•</span>
                  <span className="spec-item">🍎 iOS</span>
                </div>
              </div>

              {/* Right Column: Hero Artwork Showcase Frame */}
              <div className="hero-artwork-col">
                <div className="hero-artwork-frame">
                  <div className="frame-corner tl"></div>
                  <div className="frame-corner tr"></div>
                  <div className="frame-corner bl"></div>
                  <div className="frame-corner br"></div>
                  <div className="frame-glow-aura"></div>
                  <img
                    src={activeBanner.image}
                    alt={activeBanner.title}
                    className="hero-artwork-img"
                  />
                  <div className="frame-bottom-caption">
                    <span className="caption-tag">SERVER S1</span>
                    <span className="caption-title">{activeBanner.title}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          className="slider-nav-arrow arrow-prev"
          onClick={handlePrevSlide}
          aria-label="Previous Slide"
        >
          <span>‹</span>
        </button>
        <button
          className="slider-nav-arrow arrow-next"
          onClick={handleNextSlide}
          aria-label="Next Slide"
        >
          <span>›</span>
        </button>

        {/* Indicators */}
        <div className="slider-dots-dock">
          {BANNERS.map((_, idx) => (
            <button
              key={idx}
              className={`dot-pill ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => {
                setDirection(idx > currentSlide ? 1 : -1);
                setCurrentSlide(idx);
              }}
              aria-label={`Slide ${idx + 1}`}
            >
              {idx === currentSlide && (
                <motion.div
                  layoutId="activeSlideIndicator"
                  className="dot-active-fill"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
