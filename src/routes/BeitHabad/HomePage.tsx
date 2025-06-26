import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CandleLightingTimes from '../../components/CandleLightingTimes/CandleLightingTimes';
import MainBanner from '../../components/mainBanner/MainBanner';

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const anchor = location.hash.replace('#', '');
      const el = document.getElementById(anchor);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100); // זמן המתנה קצר אחרי טעינה
      }
    }
  }, [location]);

  return (
    <div>
      <MainBanner />
      <section className=" zmanim-section" id="zmanim-section">
        <CandleLightingTimes />
      </section>
      <section id="shabbat-section" className="shabbat-section">
      </section>

    </div>
  );
};

export default HomePage;
