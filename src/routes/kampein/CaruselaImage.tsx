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
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false); // מצב לאנימציה

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000); // כל 5 שניות

        return () => clearInterval(interval); // לנקות את ה-interval כשמעבר לדף אחר
    }, []);

    const nextSlide = () => {
        setIsAnimating(true); // הפעלת האנימציה
        setTimeout(() => setIsAnimating(false), 500); // כיבוי האנימציה לאחר 500ms
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
            <div className="carousel-track">
                {getDisplayedImages().map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`carousel-img-${index}`}
                        className={`carousel-img ${isAnimating ? 'fade-in' : ''}`} // הוספת מחלקת fade-in לכל התמונות המוצגות
                    />
                ))}
            </div>
        </div>
    );
};

export default CaruselaImage;