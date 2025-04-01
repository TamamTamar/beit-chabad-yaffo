import React, { useEffect, useState } from 'react';
import './carousel.scss';

const CaruselaImage = () => {
    // טעינת התמונות באופן דינמי מתוך תיקייה
    const importAll = (r: any) => r.keys().map(r);
    const images = importAll((require as any).context('../../assets/images', false, /\.(jpeg|jpg|png)$/));

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

export default CaruselaImage;