import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import BackgroundCanvas from '../components/common/BackgroundCanvas';
import '../styles/variables.css';
import '../styles/animations.css';
import '../styles/main.css';

export default function MainLayout({ children }) {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Isolate Admin panel
  if (location.pathname.startsWith('/admin')) {
    return (
      <div className="admin-root-wrapper">
        {children}
      </div>
    );
  }

  return (
    <div className="game-app-wrapper">
      <BackgroundCanvas />
      <Navbar />
      <main className="main-content-area">
        {children}
      </main>
      <Footer />
    </div>
  );
}
