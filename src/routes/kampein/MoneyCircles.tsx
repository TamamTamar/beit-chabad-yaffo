import React, { useState } from 'react';
import './MoneyCircles.scss';
import PaymentForm from './PaymentForm';

const MoneyCircles = () => {
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [amount, setAmount] = useState(0);

    const handleButtonClick = (amount: number) => {
        setAmount(amount);
        setShowPaymentForm(true);
    };

    const closePaymentForm = () => {
        setShowPaymentForm(false);
    };

    const renderButton = (amount: number) => (
        <button className="circle" onClick={() => handleButtonClick(amount)}>
            <p className="amount">{amount}₪ לחודש</p>
            <p className="yearly">{amount * 12}₪ לשנה</p>
        </button>
    );

    return (
        <div className="money-circles-container">
            <div className="money-circles">
                <button className="circle" onClick={() => handleButtonClick(0)}><strong>סכום אחר</strong></button>
                {renderButton(5000)}
                {renderButton(2000)}
                {renderButton(1000)}
                {renderButton(500)}
                {renderButton(300)}
            </div>
            {showPaymentForm && (
                <div className="overlay">
                    <div className="payment-form-wrapper">
                        <button className="close-button" onClick={closePaymentForm}><img src="/img/kampein/x.svg" alt="" /></button>
                        <PaymentForm monthlyAmount={amount} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MoneyCircles;