import React, { useState, useEffect } from 'react';
import './carousel.scss';

const CaruselaImage = () => {
    const images = [
        '/img/1.jpeg',
        '/img/2.jpeg',
        '/img/3.jpeg',
        '/img/4.jpeg',
        '/img/5.jpeg',
        '/img/6.jpeg',
        '/img/7.jpeg',
        '/img/8.jpeg',
        '/img/9.jpeg',
        '/img/10.jpeg',
        '/img/11.jpeg',
        '/img/12.jpeg',
        '/img/13.jpeg',
        '/img/14.jpeg',
        '/img/15.jpeg',
        '/img/16.jpeg',
        '/img/17.jpeg',
        '/img/18.jpeg',
        '/img/19.jpeg',
        '/img/20.jpeg',
        '/img/21.jpeg',
        '/img/22.jpeg',
        '/img/23.jpeg',
        '/img/24.jpeg',
        '/img/25.jpeg',
        '/img/26.jpeg',
        '/img/27.jpeg',
        '/img/28.jpeg',
        '/img/29.jpeg',
        '/img/30.jpeg',
        '/img/31.jpeg',
        '/img/32.jpeg',
        '/img/33.jpeg',
        '/img/34.jpeg',
        '/img/35.jpeg',
        '/img/36.jpeg',
        '/img/37.jpeg',
        '/img/38.jpeg',
        '/img/39.jpeg',
        '/img/40.jpeg',
        '/img/41.jpeg',
        '/img/42.jpeg',
        '/img/43.jpeg',
        '/img/44.jpeg',
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000); // כל 5 שניות

        return () => clearInterval(interval); // לנקות את ה-interval כשמעבר לדף אחר
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const getDisplayedImages = () => {
        return [
            images[currentIndex % images.length],
            images[(currentIndex + 1) % images.length],
            images[(currentIndex + 2) % images.length],
        ];
    };

    return (
        <div className="carousel-container">
            <div className="carousel-track"
            >
                {getDisplayedImages().map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`carousel-img-${index}`}
                        className="carousel-img"
                    />
                ))}
            </div>
        </div>
    );
};

export default CaruselaImage;
