import React, { FC, useState, useEffect } from 'react';
import { Carousel } from 'flowbite-react';
import './carousel.scss';

const CarouselNew: FC = () => {
    const images = [
        { _id: 1, url: 'img/b1.png', alt: 'Image 1' },
        { _id: 2, url: 'img/b3.png', alt: 'Image 2' },
        { _id: 3, url: 'img/b4.png', alt: 'Image 3' },
        { _id: 4, url: 'img/b5.png', alt: 'Image 4' },
        { _id: 5, url: 'img/b22.png', alt: 'Image 5' },
        { _id: 6, url: 'img/banner.jpg', alt: 'Image 6' },
        { _id: 7, url: 'img/hanuca.jpeg', alt: 'Image 7' },
        { _id: 8, url: 'img/light.png', alt: 'Image 8' },
        { _id: 9, url: 'img/carousellla.png', alt: 'Image 9' },
        { _id: 10, url: 'img/light2.png', alt: 'Image 10' },
    ];

    const groupedImages = [];
    for (let i = 0; i < images.length; i += 3) {
        groupedImages.push(images.slice(i, i + 3));
    }

    const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentGroupIndex((prevIndex) => (prevIndex + 1) % groupedImages.length);
        }, 2000); // כל 2 שניות

        return () => clearInterval(interval); // לנקות את ה-interval כשמעבר לדף אחר
    }, [groupedImages.length]);

    return (
        <div className="custom-carousel">
            <Carousel>
                <div className="carousel-inner">
                    {groupedImages.map((group, index) => (
                        <div
                            key={index}
                            className={`carousel-item ${index === currentGroupIndex ? 'active' : ''}`}
                        >
                            <div className="grid grid-cols-3 gap-4">
                                {group.map((image) => (
                                    <img
                                        key={image._id}
                                        src={image.url}
                                        alt={image.alt}
                                        className="carousel-image"
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Carousel>
        </div>
    );
};

export default CarouselNew;
