import React, { useState } from 'react';
import './KampeinBanner.scss';
import Aboutkampein from './AboutKampein';

const KampeinBanner = () => {
  const [showInfo, setShowInfo] = useState(false);

  const handleButtonClick = () => {
    setShowInfo(true);
  };

  const closeInfo = () => {
    setShowInfo(false);
  };

  return (
    <div className="kampein-banner">
      <img src="/img/kampein/logo chabad.svg" alt="logo" className="kampein-banner-image" />
      <h2 className="kampein-banner-title">אור ליהודי יפו – בזכותכם!</h2>
      <p className="kampein-banner-description">הצטרפו לתמיכה בפעילות השוטפת של בית חב״ד יפו</p>

      <div className="kampein-buttons">
        <button className="kampein-banner-button" onClick={handleButtonClick}>
          אודות הקמפיין
        </button>
        <a
          href="https://www.matara.pro/nedarimplus/online/?mosad=7004217"
          target="_blank"
          rel="noopener noreferrer"
          className="donate-button"
        >
          לתרומה
        </a>
      </div>

      {showInfo && (
        <div className="overlay">
          <div className="info-wrapper">
            <button className="close-button" onClick={closeInfo}>
              <img src="/img/kampein/x.svg" alt="Close" />
            </button>
            <div className="info-content">
              <Aboutkampein />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KampeinBanner;
