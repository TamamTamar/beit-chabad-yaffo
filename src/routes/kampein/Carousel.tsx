import React, { useState, useEffect } from 'react';
import './carousel.scss';

const Carousel = () => {
  const images = [
    'img/b1.png',
    'img/b3.png',
    'img/b4.png',
    'img/b5.png',
    'img/b22.png',
    'img/banner.jpg',
    'img/hanuca.jpeg',
    'img/light.png',
    'img/carousellla.png',
    'img/light2.png',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // כל 3 שניות

    return () => clearInterval(interval); // לנקות את ה-interval כשמעבר לדף אחר
  }, [images.length]);

  // הצגת התמונות הנוכחיות (3 תמונות)
  const displayedImages = [
    images[(currentIndex) % images.length],
    images[(currentIndex + 1) % images.length],
    images[(currentIndex + 2) % images.length],
  ];

  return (
    <div className="carousel-container">
      <div className="carousel">
        <div className="carousel-images">
          {displayedImages.map((image, index) => (
            <img
              className="carousel-img"
              key={index}
              src={image}
              alt={`carousel-img-${index}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
