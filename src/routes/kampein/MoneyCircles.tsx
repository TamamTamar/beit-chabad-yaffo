import React, { useState } from 'react';
import './MoneyCircles.scss';
import PaymentForm from './paymentForm/PaymentForm';

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
            <div className="amount-wrapper">
                <p className="amount">₪ {amount}</p>
                <div className="to-month">לחודש</div>
            </div>
        </button>
    );

    return (
        <div className="money-circles-container">
            <div className="money-circles">
                <button className="circle" onClick={() => handleButtonClick(0)}>
                    <span className='another-amount'>סכום  <br /> חופשי</span>
                </button>
                {renderButton(150)}
                {renderButton(250)}
                {renderButton(360)}
                {renderButton(500)}
                {renderButton(770)}
            </div>
            {showPaymentForm && (
                <div className="overlay">
                    <div className="payment-form-wrapper">
                        <button className="close-button" onClick={closePaymentForm}>
                            <img src="/img/kampein/x.svg" alt="Close" />
                        </button>
                        <PaymentForm monthlyAmount={amount} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MoneyCircles;