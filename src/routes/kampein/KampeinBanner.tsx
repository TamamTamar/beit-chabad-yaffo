import React, { useState } from 'react';
import './KampeinBanner.scss';
import Aboutkampein from './Aboutkampein';

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
      <button className='kampein-banner-button' onClick={handleButtonClick}>אודות הקמפיין</button>
      {showInfo && (
        <div className="overlay">
          <div className="info-wrapper">
            <button className="close-button" onClick={closeInfo}><img src="/img/kampein/x.svg" alt="Close" /></button>
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