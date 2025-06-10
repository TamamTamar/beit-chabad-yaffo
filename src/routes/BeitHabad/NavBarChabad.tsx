
import { NavLink, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './NavBarChabad.scss';

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
                <NavLink to="/" className="navbar__logo">
                    <img src="img/logo-nav.png" alt="בית חב״ד יפו" />
                </NavLink>

                <nav className="navbar__menu">
                    <NavLink to="/">דף ראשי</NavLink>
                    <NavLink to="/beit-chabad">בית חב״ד</NavLink>
                    <NavLink to="/branches">סניפים</NavLink>
                    <NavLink to="/shabbat">שבת וחג</NavLink>
                    <NavLink to="/#shabbat-section">סעודות שבת</NavLink>
                    <NavLink to="/#zmanim-section">זמני היום</NavLink>
                    <NavLink to="/donation" className="donation-link">תרומה</NavLink>
                </nav>
            </div>
        </header>
    );
};

export default NavBarChabad;
