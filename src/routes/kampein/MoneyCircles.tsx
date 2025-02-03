import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MoneyCircles.scss';

const MoneyCircles = () => {
    const navigate = useNavigate();

    const handleButtonClick = (amount: number) => {
        navigate('/paymentform', { state: { amount } });
    };

    return (
        <div className="money-circles">
            <button className="circle" onClick={() => handleButtonClick(300)}>300 ש"ח</button>
            <button className="circle" onClick={() => handleButtonClick(500)}>500 ש"ח</button>
            <button className="circle" onClick={() => handleButtonClick(1000)}>1,000 ש"ח</button>
            <button className="circle" onClick={() => handleButtonClick(2000)}>2,000 ש"ח</button>
            <button className="circle" onClick={() => handleButtonClick(5000)}>5,000 ש"ח</button>
            <button className="circle" onClick={() => handleButtonClick(0)}>סכום אחר</button>
        </div>
    );
};

export default MoneyCircles;
