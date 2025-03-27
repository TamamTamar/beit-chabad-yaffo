import React from 'react';
import { useLocation } from 'react-router-dom';

const ShabbatSelector = () => {
    const location = useLocation();
    const { parasha } = location.state || {};

    return (
        <div className="registration-page">
            <h1>הרשמה עבור {parasha?.parasha}</h1>
            <p>תאריך: {parasha?.date}</p>
            <button onClick={() => window.history.back()}>חזור</button>
        </div>
    );
};

export default ShabbatSelector;