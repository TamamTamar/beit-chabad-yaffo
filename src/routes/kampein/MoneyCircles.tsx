import React, { useState } from 'react';
import './MoneyCircles.scss';
import PaymentForm from './PaymentForm';

const MoneyCircles = () => {
    const [amount, setAmount] = useState<number>(0);
    const [showCustomForm, setShowCustomForm] = useState<boolean>(false); // סטייט כדי להציג את הטופס החופשי

    return (
        <div className="money-circles">
            <button className="circle" onClick={() => setAmount(300)}>300 ש"ח</button>
            <button className="circle" onClick={() => setAmount(500)}>500 ש"ח</button>
            <button className="circle" onClick={() => setAmount(1000)}>1,000 ש"ח</button>
            <button className="circle" onClick={() => setAmount(2000)}>2,000 ש"ח</button>
            <button className="circle" onClick={() => setAmount(5000)}>5,000 ש"ח</button>
            <button className="circle" onClick={() => setAmount(0)}>סכום אחר</button>

      

            {/* אם נבחר סכום חופשי, מציג את הטופס */}
            {showCustomForm && (
                <div className="custom-form">
                    <h3>בחר סכום חופשי</h3>
                    <input 
                        type="number" 
                        onChange={(e) => setAmount(Number(e.target.value))} 
                        placeholder="הכנס סכום" 
                    />
                    <button 
                        onClick={() => setShowCustomForm(false)}
                    >
                        סיים
                    </button>
                </div>
            )}

            {/* מציג את טופס התשלום רק אם יש סכום */}
            {amount >= 0 && (
                <PaymentForm 
                    amount={amount} 
                    institutionId="12345"
                    apiValid="true"
                    zeout="123456789"
                    firstName="תורם"
                    lastName="לדוגמה"
                    street="רחוב לדוגמה"
                    city="עיר לדוגמה"
                    phone="0501234567"
                    email="donor@example.com"
                    paymentType="Ragil"
                    tashlumim={1}
                    currency={1}
                    groupe="תרומות"
                    comment="תרומה כללית"
                    param1=""
                    param2=""
                    callBack="https://yourwebsite.com/success"
                    callBackMailError="https://yourwebsite.com/error"
                />
            )}
        </div>
    );
};

export default MoneyCircles;
