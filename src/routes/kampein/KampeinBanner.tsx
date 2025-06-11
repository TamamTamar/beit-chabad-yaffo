import React, { useState } from 'react';
import './KampeinBanner.scss';
import Aboutkampein from './AboutKampein';
import PaymentForm from './paymentForm/PaymentForm';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

<Helmet>
  <title>קמפיין חב"ד יפו - תנו יד לשליחות</title>
  <meta name="description" content="הצטרפו למען המשך פעילות חב״ד ביפו - הבית של כל יהודי. תרמו עכשיו והיו שותפים לשליחות." />
  <meta name="keywords" content="חבד יפו, תרומות, קמפיין, שליחות, צדקה, יהדות, תרומה לחבד" />
  <meta property="og:title" content="קמפיין חב״ד יפו" />
  <meta property="og:description" content="תמכו בשליחות חב״ד ביפו – תרמו עכשיו והפיצו אור יהדות." />
  <meta property="og:image" content="https://beit-chabad-yaffo.onrender.com/img/kampein/banner-u.png" />
</Helmet>


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
      <h1 className="kampein-banner-title">יחד ממשיכים את השליחות ביפו</h1>
      <p className="kampein-banner-description">הבית של כל יהודי – בזכותכם.
        תרמו והיו שותפים</p>
      <div className="kampein-buttons">
        <button
          className="donate-button"
          onClick={() => setShowPaymentForm(true)}
        >
          תרום עכשיו
        </button>
        <button
          className="info-button"
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
          <div className="payment-form-wrapper">
            <button className="close-button" onClick={closePaymentForm}>
              <img src="/img/kampein/x.svg" alt="Close" />
            </button>
            <PaymentForm monthlyAmount={0} />
          </div>
        </div>
      )}
    </div>
  );
};

export default KampeinBanner;