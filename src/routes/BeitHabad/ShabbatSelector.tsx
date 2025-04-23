import React, { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { newRishum } from '../../services/shabbatService';
import './ShabbatSelector.scss';
import { RishumShabbatInput, RishumShabbatType } from '../../@Types/chabadType';
import { showErrorDialog, showSuccessDialog } from '../../ui/dialogs';
import PaymentFormStep2 from '../kampein/PaymentFormStep2';

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
    const childPrice = 100; // מחיר לילד בשקלים

    const totalPrice =
        watch('adults') * adultPrice + watch('children') * childPrice;

    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // פונקציה לשליחת הודעות ל-iframe

    const handlePaymentClick = () => {
        const payBtDiv = document.getElementById('PayBtDiv');
        const waitPay = document.getElementById('WaitPay');
        if (payBtDiv) payBtDiv.style.display = 'none';
        if (waitPay) waitPay.style.display = 'block';

        // יצירת הנתונים במבנה המתאים
        const newPaymentData = {
            Mosad: "7013920",
            ApiValid: "zidFYCLaNi",
            Zeout: "123456789", // מספר זהות (ניתן להוסיף שדה בטופס אם נדרש)
            FirstName: watch('name').split(' ')[0] || '', // שם פרטי
            LastName: watch('name').split(' ')[1] || '', // שם משפחה
            Street: "", // ניתן להוסיף שדה בטופס
            City: "", // ניתן להוסיף שדה בטופס
            Phone: watch('phone'),
            Mail: "", // ניתן להוסיף שדה בטופס
            PaymentType: "Ragil", // סוג תשלום (רגיל או הוראת קבע)
            Amount: totalPrice,
            Tashlumim: 1, // מספר תשלומים (ניתן להוסיף שדה בטופס אם נדרש)
            Currency: 1, // מטבע (1 = שקלים)
            Groupe: "", // קבוצה (לדוגמה: שבת)
            Comment: ``, // הערה
            CallBack: "https://node-beit-chabad-yaffo.onrender.com/api/payment/nedarim",
            CallBackMailError: "lchabadyaffo@gmail.com",
        };

        // קריאה לפונקציה PostNedarim עם הנתונים
        function PostNedarim(Data: object) {
            if (iframeRef.current && iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage(Data, '*');
            } else {
                console.error("⚠️ לא ניתן לשלוח הודעה ל-iframe.");
            }
        }

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
                <PaymentFormStep2
                    iframeRef={iframeRef}
                    paymentData={paymentData}
                  />
            </div>
        </form>
    );
};

export default ShabbatSelector;