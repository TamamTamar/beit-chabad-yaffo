import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { newRishum } from '../../services/shabbatService';
import './ShabbatSelector.scss';
import { RishumShabbatInput, RishumShabbatType } from '../../@Types/chabadType';



const ShabbatSelector = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { parasha } = location.state || {};

    const { register, handleSubmit, watch, setValue } = useForm<RishumShabbatInput>({
        defaultValues: {
            name: '',
            adults: 0,
            children: 0,
        },
    });

    const adultPrice = 150; // מחיר למבוגר בשקלים
    const childPrice = 100; // מחיר לילד בשקלים

    const totalPrice =
        watch('adults') * adultPrice + watch('children') * childPrice;

    const onSubmit: SubmitHandler<RishumShabbatInput> = async (data) => {
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
            name: data.name,
            phone: data.phone,
            people: {
                adults: {
                    quantity: data.adults,
                    price: data.adults * adultPrice,
                },
                children: {
                    quantity: data.children,
                    price: data.children * childPrice,
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
        <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
            <div className="registration-page">
                <h1 className="registration-title">
                    {parasha ? parasha.parasha : 'פרשה לא נבחרה'}
                </h1>
                <p className="registration-date">תאריך: {parasha?.date}</p>
                <button
                    type="button"
                    className="back-button"
                    onClick={() => navigate('/shabbat')}
                >
                    לתאריכים נוספים
                </button>
            </div>
            <div className="form-group">
                <label htmlFor="name">שם מלא:</label>
                <input
                    id="name"
                    type="text"
                    {...register('name', { required: true })}
                    placeholder="הכנס שם מלא"
                />
            </div>
            <div className="form-group">
                <label htmlFor="phone">מספר טלפון:</label>
                <input
                    id="phone"
                    type="tel"
                    {...register('phone', { required: true })}
                    placeholder="הכנס מספר טלפון"
                />
            </div>
            <div className="form-group">
                <label htmlFor="adults">מבוגרים:</label>
                <input
                    id="adults"
                    type="number"
                    min="0"
                    {...register('adults', { required: true, valueAsNumber: true })}
                />
                <span>מחיר ליחידה: ₪{adultPrice}</span>
            </div>
            <div className="form-group">
                <label htmlFor="children">ילדים:</label>
                <input
                    id="children"
                    type="number"
                    min="0"
                    {...register('children', { required: true, valueAsNumber: true })}
                />
                <span>מחיר ליחידה: ₪{childPrice}</span>
            </div>
            <div className="total-price">
                <span>סה"כ לתשלום: ₪</span>
                <span className="price-amount">{totalPrice}</span>
            </div>
            <button type="submit" className="confirm-button">
                אישור
            </button>
        </form>
    );
};

export default ShabbatSelector;