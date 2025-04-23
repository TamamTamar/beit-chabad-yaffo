import React, { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { newRishum } from '../../services/shabbatService';
import './ShabbatSelector.scss';
import { RishumShabbatInput, RishumShabbatType } from '../../@Types/chabadType';
import { showErrorDialog, showSuccessDialog } from '../../ui/dialogs';

const ShabbatSelector = () => {
    const navigate = useNavigate();
    const [paymentData, setPaymentData] = useState(null);
    const location = useLocation();
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const { parasha } = location.state || {};

    const { register, handleSubmit, watch } = useForm<RishumShabbatInput>({
        defaultValues: {
            name: '',
            phone: '',
            adults: 0,
            children: 0,
        },
    });

    const adultPrice = 1; // מחיר למבוגר בשקלים
    const childPrice = 1; // מחיר לילד בשקלים

    const totalPrice =
        watch('adults') * adultPrice + watch('children') * childPrice;

    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // פונקציה לשליחת הודעות ל-iframe
    const PostNedarim = (Data: object) => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(Data, '*');
        } else {
            console.error("⚠️ לא ניתן לשלוח הודעה ל-iframe.");
        }
    };

    const handlePaymentClick = () => {
        const payBtDiv = document.getElementById('PayBtDiv');
        const waitPay = document.getElementById('WaitPay');
        if (payBtDiv) payBtDiv.style.display = 'none';
        if (waitPay) waitPay.style.display = 'block';

        // קריאה לפונקציה PostNedarim עם הנתונים
        PostNedarim({
            Name: 'FinishTransaction2',
            Value: {
                Amount: totalPrice,
                Description: 'תשלום עבור שבת',
                FullName: watch('name'),
                Phone: watch('phone'),
            },
        });

        setIsProcessingPayment(true);
    };

    const handlePaymentCompletion = () => {
        setPaymentCompleted(true);
        setIsProcessingPayment(false);
        showSuccessDialog('תשלום הושלם', 'תודה על התשלום!');
    };

    const onSubmit: SubmitHandler<RishumShabbatInput> = async (data) => {
        if (!parasha) {
            showErrorDialog('שגיאה', 'לא נבחרה פרשה.');
            return;
        }

        if (!paymentCompleted) {
            showErrorDialog('שגיאה', 'יש להשלים את התשלום לפני ההגשה.');
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
            setPaymentData(rishum);
            showSuccessDialog('רישום הושלם', 'תודה על הרישום!');
            navigate('/confirmation');
        } catch (error) {
            console.error('שגיאה בשמירת הרישום:', error);
            showErrorDialog('שגיאה', 'לא הצלחנו לשמור את הרישום שלך.');
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
            <div className="payment-section">
                <h3>תשלום:</h3>
                <div id="WaitPay" className="wait-pay">⏳ מעבד תשלום...</div>
                <iframe
                    ref={iframeRef}
                    id="NedarimFrame"
                    title="Nedarim Plus"
                    src={`https://matara.pro/nedarimplus/iframe?language=he&Amount=${totalPrice}`}
                    className="payment-iframe"
                    scrolling="no"
                />
                <div id="ErrorDiv" className="error-div"></div>
                <div id="OkDiv" className="ok-div">✔️ התשלום הצליח!</div>
            </div>
            <button
                type={paymentCompleted ? 'submit' : 'button'}
                className="confirm-button"
                onClick={!paymentCompleted ? handlePaymentClick : undefined}
                disabled={isProcessingPayment}
            >
                {paymentCompleted ? 'אישור' : 'בצע תשלום'}
            </button>
        </form>
    );
};

export default ShabbatSelector;