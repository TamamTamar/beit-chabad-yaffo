import { useState, useEffect } from "react";
import { bannersData } from "./bannersData";
import { useNavigate } from "react-router-dom";
import "./MainBanner.scss";

const MainBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannersData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentBanner = bannersData[currentIndex];

  return (
    <div
      className={`banner-container ${currentBanner.className}`}
     /*  style={{ backgroundImage: `url(${currentBanner.image})` }} */
    >
      <div className="banner-content">
        <h2 className="banner-title">{currentBanner.title}</h2>
        <p className="banner-subtitle">{currentBanner.subtitle}</p>
        <button className="banner-button" onClick={() => navigate(currentBanner.navigateTo)}>
          {currentBanner.buttonText}
        </button>
      </div>
      <div className="dots">
        {bannersData.map((_, index) => (
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
