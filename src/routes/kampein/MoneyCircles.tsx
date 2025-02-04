import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MoneyCircles.scss';

const MoneyCircles = () => {
    const navigate = useNavigate();

    const handleButtonClick = (amount: number) => {
        navigate('/paymentform', { state: { amount } });
    };

    const renderButton = (amount: number) => (
        <button className="circle" onClick={() => handleButtonClick(amount)}>
            <p className="amount">{amount}₪ לחודש</p>
            <p className="yearly">{amount * 12}₪ לשנה</p>
        </button>
    );

    return (
        <div className="money-circles">
            <button className="circle" onClick={() => handleButtonClick(0)}><strong>סכום אחר</strong></button>
            {renderButton(5000)}
            {renderButton(2000)}
            {renderButton(1000)}
            {renderButton(500)}
            {renderButton(300)}
        </div>
    );
};

export default MoneyCircles;