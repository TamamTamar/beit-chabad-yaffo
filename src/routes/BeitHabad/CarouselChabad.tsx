import React, { FC } from 'react';
import { Carousel } from 'flowbite-react';
import './CarouselChabad.scss';


const CarouselChabd: FC = () => {
    return (
        <div className="custom-carousel">
            <Carousel pauseOnHover>
                <img
                    src="/img/Banner.jpg"
                    alt="Elegant Dresses Cover 1"
                    className="carousel-image desktop-image"
                />
                {/* <img
                    src="/img/PikiWiki_Israel_32536_Old_Jaffa.JPG"
                    alt="Second Image for Desktop"
                    className="carousel-image desktop-image"
                /> */}
            </Carousel>
        </div>
    );
};

export default CarouselChabd;
