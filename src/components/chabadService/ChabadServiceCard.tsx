import React, { useEffect, useRef, useState } from 'react';

const ServiceCard = ({ icon, title, description }) => {
    const [isVisible, setIsVisible] = useState(false);
    const iconRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // הכרטיס נראה בתצוגה
                        setIsVisible(true);
                    } else {
                        // הכרטיס יצא מהתצוגה
                        setIsVisible(false);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (iconRef.current) observer.observe(iconRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className="card-heb">
            <div
                className={`icon-circle ${isVisible ? 'fade-in' : ''}`}
                ref={iconRef}
            >
                <img src={icon} alt={`${title} Icon`} />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};

export default ServiceCard;
