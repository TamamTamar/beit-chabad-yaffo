import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bannersData } from "./bannersData";
import "./MainBanner.scss";

const MainBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannersData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentBanner = bannersData[currentIndex];

  return (
    <div className={`banner-container ${currentBanner.className}`}>
      <div className="banner">
        <h2>{currentBanner.title}</h2>
        <p>{currentBanner.subtitle}</p>
        <button onClick={() => navigate(currentBanner.navigateTo)}>
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
