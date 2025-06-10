import './MainBanner.scss';

const MainBanner = () => {
  return (
    <section className="main-banner">
      <div className="banner-content">
        <h1 className='banner-title'>בית חב״ד יפו</h1>
        <h2 className='banner-subtitle'>ברוכים הבאים ליפו</h2>
        <div className="banner-buttons">
          <button className="info-btn">מידע</button>
          <button className="shabbat-btn">שבת וחג</button>
        </div>
      </div>
    </section>
  );
};

export default MainBanner;
