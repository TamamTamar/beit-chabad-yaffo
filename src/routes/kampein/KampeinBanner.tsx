import React, { useState } from 'react';
import './KampeinBanner.scss';
import Aboutkampein from './AboutKampein';
import PaymentForm from './PaymentForm'; // ייבוא רכיב הטופס
import { useNavigate } from 'react-router-dom';

const KampeinBanner = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false); // state לניהול תצוגת הטופס
  const navigate = useNavigate();

  const handleButtonClick = () => {
    setShowInfo(true);
  };

  const closeInfo = () => {
    setShowInfo(false);
  };

  if (showPaymentForm) {
    return <PaymentForm monthlyAmount={0} />; // הצגת רכיב הטופס עם סכום ברירת מחדל
  }

  return (
    <div className="kampein-banner">

      <div className="kampein-buttons">

        <h2 className="kampein-banner-title">אור ליהודי יפו – בזכותכם!</h2>
        <p className="kampein-banner-description">הצטרפו לתמיכה בפעילות השוטפת של בית חב״ד יפו</p>

            <button className="donate-button" onClick={handleButtonClick}>
          אודות הקמפיין
        </button>
        <button
          className="donate-button"
          onClick={() => {
            setShowPaymentForm(true); // הצגת רכיב הטופס
          }}
        >
          תרום עכשיו
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
    </div>
  );
};

export default KampeinBanner;