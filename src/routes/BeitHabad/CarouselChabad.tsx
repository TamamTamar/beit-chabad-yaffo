import React, { FC } from 'react';
import { Carousel } from 'flowbite-react';
import './CarouselChabad.scss';

const CarouselChabd: FC = () => {
    return (
        <div className="custom-carousel">
            <Carousel slideInterval={5000} pauseOnHover>
                <img
                    src="/img/1.jpeg"
                    alt="Image 1"
                    className="carousel-image desktop-image"
                />
                <img
                    src="/img/2.jpeg"
                    alt="Image 2"
                    className="carousel-image desktop-image"
                />
                <img
                    src="/img/3.jpeg"
                    alt="Image 3"
                    className="carousel-image desktop-image"
                />
                <img
                    src="/img/4.jpeg"
                    alt="Image 4"
                    className="carousel-image desktop-image"
                />
                <img
                    src="/img/5.jpeg"
                    alt="Image 5"
                    className="carousel-image desktop-image"
                />
            </Carousel>
        </div>
    );
};

export default CarouselChabd;
