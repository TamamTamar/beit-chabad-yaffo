import React, { useState } from 'react';
import './KampeinBanner.scss';
import Aboutkampein from './AboutKampein';
import PaymentForm from './PaymentForm';
import { useNavigate } from 'react-router-dom';

const KampeinBanner = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    setShowInfo(true);
  };

  const closeInfo = () => {
    setShowInfo(false);
  };

  const closePaymentForm = () => {
    setShowPaymentForm(false);
  };

  return (
    <div className="kampein-banner">
      <h2 className="kampein-banner-title">אור ליהודי יפו – בזכותכם!</h2>
      <p className="kampein-banner-description">הצטרפו לתמיכה בפעילות השוטפת של בית חב״ד יפו</p>
      <div className="kampein-buttons">
        <button
          className="donate-button"
          onClick={() => setShowPaymentForm(true)}
        >
          תרום עכשיו
        </button>
        <button
          className="donate-button"
          onClick={handleButtonClick}
        >
          אודות הקמפיין
        </button>
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

      {showPaymentForm && (
        <div className="overlay">
          <div className="info-wrapper">
            <button className="close-button" onClick={closePaymentForm}>
              <img src="/img/kampein/x.svg" alt="Close" />
            </button>
            <div className="info-content">
              <PaymentForm monthlyAmount={0} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KampeinBanner;