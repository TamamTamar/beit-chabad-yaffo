import React, { FC } from 'react';
import './AboutChabad.scss';
import { Link } from 'react-router-dom';


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
            <Link to='/Campein' className="chabad-about-button">תרומה</Link>
            <Link to='/shabbat' className="chabad-about-button">הרשמה לשבת</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChabadAboutSection;
