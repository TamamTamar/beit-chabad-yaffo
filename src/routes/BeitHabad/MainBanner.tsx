import { useState, useEffect } from "react";
import Banner1 from "./Banner1";
import Banner2 from "./Banner2";
import Banner3 from "./Banner3";
import "./MainBanner.scss";


const banners = [<Banner1 />, <Banner2 />, <Banner3 />];

const MainBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000); // שינוי כל 5 שניות

    return () => clearInterval(interval); // ניקוי ה-interval כשיוצאים מהקומפוננטה
  }, []);

  return (
    <div className="banner-container">
      {banners[currentIndex]}
      <div className="dots">
        {banners.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default MainBanner;
