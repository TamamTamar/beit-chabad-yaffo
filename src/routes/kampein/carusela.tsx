import React, { FC } from 'react';
import { Carousel } from 'flowbite-react';
import './carousel.scss';

const CarouselNew: FC = () => {
    const images = [
        { _id: 1, url: 'img/b1.png', alt: 'Image 1' },
        { _id: 2, url: 'img/b3.png', alt: 'Image 2' },
        { _id: 3, url: 'img/b4.png', alt: 'Image 3' },
        { _id: 4, url: 'img/b5.png', alt: 'Image 4' },
        { _id: 5, url: 'img/b22.png', alt: 'Image 5' },
    ];

    return (
        <div className="custom-carousel">
            <Carousel pauseOnHover>
                {images.map((image) => (
                    <img
                        key={image._id}
                        src={image.url}
                        alt={image.alt}
                        className="carousel-image desktop-image"
                    />
                ))}
            </Carousel>
        </div>
    );
};

export default CarouselNew;