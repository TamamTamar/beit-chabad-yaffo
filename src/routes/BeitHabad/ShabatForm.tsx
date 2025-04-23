import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { fetchParashot, getCustomParashaName } from '../../services/shabbatService';
import PaymentFormStep1 from '../kampein/PaymentFormStep1';
import NedarimDonation from '../kampein/NedarimDonation';
import { PaymentData } from '../../@Types/chabadType';

const ShabatForm = ({ totalAmount }) => {
    const [step, setStep] = useState(1);
    const [paymentData, setPaymentData] = useState(null);
    const [parashot, setParashot] = useState([]);
    const [selectedParasha, setSelectedParasha] = useState(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            Zeout: "",
            FirstName: "",
            LastName: "",
            Street: "",
            City: "",
            Phone: "",
            Mail: "",
            Amount: totalAmount || 0,
            Tashlumim: 1,
            Currency: 1,
            Groupe: "",
            Comment: "",
            Dedication: "",
            PaymentType: "Ragil",
            MonthlyAmount: totalAmount || 0,
            Is12Months: (totalAmount || 0) !== 0,
        }
    });

    const watchIs12Months = watch("Is12Months");
    const watchMonthlyAmount = watch("MonthlyAmount");

    useEffect(() => {
        const monthlyAmountValue = parseFloat(watchMonthlyAmount) || 0;
        setValue("MonthlyAmount", monthlyAmountValue);
        setValue("PaymentType", watchIs12Months ? "HK" : "Ragil");
    }, [watchIs12Months, watchMonthlyAmount, setValue]);

    useEffect(() => {
        // Fetch parashot for step 1
        fetchParashot().then(setParashot);
    }, []);

    const handleParashaSelection = () => {
        if (selectedParasha) {
            setStep(2); // Move to step 2 after selecting a parasha
        }
    };

    const onSubmit = (data: PaymentData) => {
       
        const newPaymentData = {
          Mosad: "7013920",
          ApiValid: "zidFYCLaNi",
          Zeout: "123456789", // מספר זהות (ניתן להוסיף שדה בטופס אם נדרש)
          FirstName: data.FirstName.split(' ')[0], // שם פרטי
          LastName: data.LastName.split(' ')[1] || '', // שם משפחה
          Street: "", // ניתן להוסיף שדה בטופס
          City: "", // ניתן להוסיף שדה בטופס
          Phone: data.Phone,
          Mail: "", // ניתן להוסיף שדה בטופס
          PaymentType: "Ragil", // סוג תשלום (רגיל או הוראת קבע)
          Amount: totalAmount,
          Tashlumim: 1, // מספר תשלומים (ניתן להוסיף שדה בטופס אם נדרש)
          Currency: 1, // מטבע (1 = שקלים)
          Groupe: "", // קבוצה (לדוגמה: שבת)
          Comment: ``, // הערה
          CallBack: "https://node-beit-chabad-yaffo.onrender.com/api/payment/nedarim",
          CallBackMailError: "lchabadyaffo@gmail.com",
        };

        setPaymentData(newPaymentData);
        setStep(3);
    };

    const handlePaymentCompletion = () => {
        setStep(4); // מעבר לשלב 4 לאחר הצלחת התשלום
    };

    const handleBack = () => {
        setStep(step === 3 ? 2 : 1); // חזרה לשלב הקודם
    };

    return (
        <div className="payment-form-container">
            <div className="step-indicator">
                <span className={step === 1 ? "active-step" : "inactive-step"}>1</span>
                <span> - </span>
                <span className={step === 2 ? "active-step" : "inactive-step"}>2</span>
                <span> - </span>
                <span className={step === 3 ? "active-step" : "inactive-step"}>3</span>
                <span> - </span>
                <span className={step === 4 ? "active-step" : "inactive-step"}>4</span>
            </div>

            {step === 1 && (
                <div className="shabbat-selection">
                    <h2>בחר פרשה</h2>
                    <select
                        className="select-shabbat"
                        onChange={(e) => {
                            const selected = parashot.find(p => p.rawDate === e.target.value);
                            setSelectedParasha(selected || null);
                        }}
                    >
                        <option value="">בחר שבת</option>
                        {parashot
                            .filter(parasha => parasha.parasha !== "פסח ז׳" && parasha.parasha !== "Pesach VII") // סינון פרשות לא רצויות
                            .map((parasha) => (
                                <option key={parasha.rawDate} value={parasha.rawDate}>
                                    {getCustomParashaName(parasha.parasha)} - {parasha.date}
                                </option>
                            ))}
                    </select>
                    <button onClick={handleParashaSelection} disabled={!selectedParasha}>
                        המשך
                    </button>
                </div>
            )}

            {step === 2 && (
                <PaymentFormStep1
                    register={register}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    errors={errors}
                    watchMonthlyAmount={watchMonthlyAmount}
                    watchIs12Months={watchIs12Months}
                    setValue={setValue}
                />
            )}

            {step === 3 && (
                <NedarimDonation
                    paymentData={paymentData}
                    handleBack={handleBack}
                    iframeRef={iframeRef}
                    onPaymentSuccess={handlePaymentCompletion}
                   // קריאה לפונקציה במעבר לשלב 4
                />
            )}

            {step === 4 && (
                <div className="confirmation-step">
                    <h2>תודה רבה!</h2>
                    <p>התשלום בוצע בהצלחה והרישום הושלם.</p>
                    <button onClick={() => setStep(1)}>חזור להתחלה</button>
                </div>
            )}
        </div>
    );
};

export default ShabatForm;