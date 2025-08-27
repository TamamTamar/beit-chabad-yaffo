import { NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './NavBarChabad.scss';
import WhatsAppButton from './WhatsAppButton';

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const NavBarChabad = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const anchor = location.hash.replace('#', '');
      scrollToSection(anchor);
    }
  }, [location]);

  return (
    <header className="navbar">
      <div className="navbar__container">
        {/* חלק 1: לוגו */}
        <div className="navbar__logo">
          <NavLink to="/">
            <img src="img/logo-nav.webp" alt="בית חב״ד יפו" />
          </NavLink>
        </div>

        {/* חלק 2: תפריט */}
        <nav className="navbar__menu">
          <NavLink to="/">דף ראשי</NavLink>
          <NavLink to="/beit-chabad">בית חב״ד</NavLink>
          <NavLink to="/branches">סניפים</NavLink>
          <NavLink to="/#zmanim-section">זמני שבת</NavLink>
        </nav>

        {/* חלק 3: כפתורים */}
        <div className="navbar__buttons">
          <NavLink to="/Campein" className="button donate">תרומה</NavLink>
          <NavLink to="/shabbatt" className="button shabbat">שבת וחג</NavLink>
        </div>
              <WhatsAppButton />
      </div>


      {/* חלק 4: קישורים נוספים */}
    </header>
  );
};

export default NavBarChabad;
