import React, { useState } from 'react';
import './MainBanner.scss';
import AboutKampein from '../../routes/kampein/AboutKampein';
import { useNavigate } from 'react-router-dom';

const MainBanner = () => {
  const navigete = useNavigate();
  const [showAbout, setShowAbout] = useState(false);

  return (
    <section className="main-banner">
      <div className="banner-content">
        <h1 className='banner-title'>בית חב״ד יפו</h1>
        <h2 className='banner-subtitle'>ברוכים הבאים ליפו</h2>
        <div className="banner-buttons">
          <button className="info-btn" onClick={() => setShowAbout(true)}>מידע</button>
          <button onClick={() => navigete('/shabbat')} className="shabbat-btn">שבת וחג</button>
        </div>
      </div>

      {showAbout && (
        <div className="about-modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="about-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowAbout(false)}>✕</button>
            <AboutKampein />
          </div>
        </div>
      )}
    </section>
  );
};

export default MainBanner;