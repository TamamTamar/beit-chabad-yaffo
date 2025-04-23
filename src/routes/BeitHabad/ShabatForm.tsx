import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import NedarimDonation from '../kampein/NedarimDonation';
import ShabbatFormStep1 from './ShabbatFormStep1';
import ShabbatFormStep2 from './ShabbatFormStep2';

const ShabatForm = ({ totalAmount }) => {
    const [step, setStep] = useState(1);
    const [paymentData, setPaymentData] = useState(null);
    const [selectedShabbat, setSelectedShabbat] = useState(null); // סטייט לפרשה שנבחרה

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

    const onSubmit = (data) => {
        const newPaymentData = {
            Mosad: "7013920",
            ApiValid: "zidFYCLaNi",
            Zeout: "123456789",
            FirstName: data.FirstName.split(' ')[0],
            LastName: data.LastName.split(' ')[1] || '',
            Street: "",
            City: "",
            Phone: data.Phone,
            Mail: "",
            PaymentType: "Ragil",
            Amount: totalAmount,
            Tashlumim: 1,
            Currency: 1,
            Groupe: "",
            Comment: "",
            CallBack: "https://node-beit-chabad-yaffo.onrender.com/api/payment/nedarim",
            CallBackMailError: "lchabadyaffo@gmail.com",
        };

        setPaymentData(newPaymentData);
        setStep(3);
    };

    const handlePaymentCompletion = () => {
        setStep(4);
    };

    const handleBack = () => {
        setStep(step === 3 ? 2 : 1);
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
                <ShabbatFormStep1
                    setStep={setStep}
                    setSelectedShabbat={setSelectedShabbat} // מעביר את הפונקציה לעדכון הפרשה שנבחרה
                />
            )}

            {step === 2 && (
                <ShabbatFormStep2
                    selectedShabbat={selectedShabbat}
                    setStep={setStep}
                />
            )}

            {step === 3 && (
                <NedarimDonation
                    paymentData={paymentData}
                    handleBack={handleBack}
                    iframeRef={iframeRef}
                    onPaymentSuccess={handlePaymentCompletion}
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