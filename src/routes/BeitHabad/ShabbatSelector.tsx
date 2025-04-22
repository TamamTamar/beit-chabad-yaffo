import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { newRishum } from '../../services/shabbatService';
import './ShabbatSelector.scss';
import { RishumShabbatType } from '../../@Types/chabadType';

const ShabbatSelector = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { parasha } = location.state || {};

    const [adultsQuantity, setAdultsQuantity] = useState(0);
    const [childrenQuantity, setChildrenQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    const adultPrice = 150; // מחיר למבוגר בשקלים
    const childPrice = 100; // מחיר לילד בשקלים

    const calculateTotalPrice = () => {
        const total = adultsQuantity * adultPrice + childrenQuantity * childPrice;
        setTotalPrice(total);
    };

    const handleRegistration = async () => {
        if (!parasha) {
            alert('לא נבחרה פרשה');
            return;
        }

        const rishum: RishumShabbatType = {
            _id: '', // ייווצר אוטומטית בשרת
            parasha: parasha.parasha,
            date: parasha.date,
            totalPrice: totalPrice,
            createdAt: new Date(),
            name: 'שם מלא לדוגמה', // ניתן להחליף בשם מהמשתמש
            people: {
                adults: {
                    quantity: adultsQuantity,
                    price: adultsQuantity * adultPrice,
                },
                children: {
                    quantity: childrenQuantity,
                    price: childrenQuantity * childPrice,
                },
            },
        };

        try {
            await newRishum(rishum);
            alert('הרישום נשמר בהצלחה!');
            navigate('/confirmation'); // נווט לעמוד אישור
        } catch (error) {
            console.error('שגיאה בשמירת הרישום:', error);
            alert('שגיאה בשמירת הרישום');
        }
    };

    return (
        <>
            <div className="registration-page">
                <h1 className="registration-title">
                    {parasha ? parasha.parasha : 'פרשה לא נבחרה'}
                </h1>
                <p className="registration-date">תאריך: {parasha?.date}</p>
                <button className="back-button" onClick={() => navigate('/shabbat')}>
                    לתאריכים נוספים
                </button>
            </div>
            <div className="product-list">
                <div className="product-item">
                    <span>מבוגרים</span>
                    <input
                        type="number"
                        min="0"
                        value={adultsQuantity}
                        onChange={(e) => {
                            setAdultsQuantity(Number(e.target.value));
                            calculateTotalPrice();
                        }}
                    />
                    <span>מחיר ליחידה: ₪{adultPrice}</span>
                </div>
                <div className="product-item">
                    <span>ילדים</span>
                    <input
                        type="number"
                        min="0"
                        value={childrenQuantity}
                        onChange={(e) => {
                            setChildrenQuantity(Number(e.target.value));
                            calculateTotalPrice();
                        }}
                    />
                    <span>מחיר ליחידה: ₪{childPrice}</span>
                </div>
            </div>
            <div className="total-price">
                <span>סה"כ לתשלום: ₪</span>
                <span className="price-amount">{totalPrice}</span>
            </div>
            <button className="confirm-button" onClick={handleRegistration}>
                אישור
            </button>
        </>
    );
};

export default ShabbatSelector;