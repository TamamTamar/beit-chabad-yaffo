import { FaWaze } from 'react-icons/fa';
import './BeitChabadPage.scss';
import CaruselaImage from '../Campein/CaruselaImage';

const BeitChabadPage = () => {
  return (
    <section className="beit-chabad-page">
      <div className="banner">
        <h1 className="banner-title">ברוכים הבאים לבית חב״ד יפו</h1>
      </div>

      <CaruselaImage />

      <div className="info">
        <h2 className="section-title">מי אנחנו?</h2>
        <p className="paragraph">הרב לוי יצחק תמם, שליח הרבי מליובאוויטש ליפו, עומד בראש הפעילות של בית חב״ד יפו.</p>
        <p className="paragraph">מטרתנו – לפעול למען כל יהודי ביפו באהבה וללא תנאים.</p>
      </div>

      <div className="hours">
        <h2 className="section-title">שעות פעילות</h2>
        <p className="paragraph">א׳–ה׳ 09:00–17:00 | יום ו׳ 09:00–13:00</p>
      </div>

      <div className="location">
        <h2 className="section-title">כתובת וניווט</h2>
        <p className="paragraph">רח׳ עולי ציון 13, יפו</p>
        <a
          href="https://waze.com/ul?ll=32.051264,34.752205&navigate=yes"
          target="_blank"
          rel="noopener noreferrer"
          className="waze-link"
        >
          <FaWaze className="waze-icon" />
        </a>
      </div>

      <div className="contact">
        <h2 className="section-title">יצירת קשר</h2>
        <p className="paragraph">וואטסאפ: <a href="https://wa.me/972535248877">053-5248877</a></p>
        <p className="paragraph">דוא״ל: <a href="mailto:Lchabadyaffo@gmail.com">Lchabadyaffo@gmail.com</a></p>
      </div>
    </section>
  );
};

export default BeitChabadPage;