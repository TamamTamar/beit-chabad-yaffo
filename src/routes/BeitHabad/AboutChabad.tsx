import React, { FC } from 'react';
import './AboutChabad.scss';


const ChabadAboutSection: FC = () => {
  return (
    <div className="chabad-about-section">
      <div className="chabad-about-content-wrapper">
        <div className="chabad-about-image">
        <img src="/img/hanuca.jpeg" alt="בית חבד" />
        </div>
        <div className="chabad-about-details">
          <h2 className="chabad-about-heading">קצת עלינו 

          </h2>
          <p className="chabad-about-description">
            בית חב"ד מודרני ונחמד ביפו, מציע מגוון שירותים לקהילה המקומית ולמבקרים. אנו מספקים אווירה חמה ומקבלת, ומזמינים את כולם להשתתף בארוחות שבת, מקווה נשים, שירותי בית הכנסת, ועוד.
          </p>
          <div className="chabad-about-buttons">
            <a href="/kampain"  className="chabad-about-button">תרומה</a>
            <button className="chabad-about-button">הרשמה לשבת</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChabadAboutSection;
