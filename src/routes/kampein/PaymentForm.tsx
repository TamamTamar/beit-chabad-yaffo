import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import patterns from "../../validations/patterns";
import "./PaymentForm.scss";
import PaymentFormStep1 from "./PaymentFormStep1";
import PaymentFormStep2 from "./PaymentFormStep2";

const PaymentForm = ({ monthlyAmount }) => {
    const [step, setStep] = useState(1);
    const [paymentData, setPaymentData] = useState(null); // מצב לשמירת הנתונים
    const [status, setStatus] = useState("idle"); // מצב לתיאור המצב הנוכחי
    const iframeRef = useRef(null);
    const initialAmount = monthlyAmount || 0;

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            Zeout: "",
            FirstName: "",
            LastName: "",
            Street: "",
            City: "",
            Phone: "",
            Mail: "",
            Amount: initialAmount,
            Tashlumim: 1,
            Currency: 1,
            Groupe: "",
            Comment: "",
            Dedication: "",
            PaymentType: "Ragil",
            MonthlyAmount: initialAmount,
            Is12Months: initialAmount !== 0,
        }
    });

    const watchIs12Months = watch("Is12Months");
    const watchMonthlyAmount = watch("MonthlyAmount");

    useEffect(() => {
        if (status === "success") {
            setTimeout(() => {
                console.log('status:', status); // הוספנו את הודעת ה-Console כאן כדי לעקוב אחרי המצב
                setStep(1);
                setStatus("idle");
            }, 5000);
        }
    }, [status]);

    useEffect(() => {
        const monthlyAmountValue = parseFloat(watchMonthlyAmount) || 0;
        setValue("MonthlyAmount", monthlyAmountValue);
        setValue("PaymentType", watchIs12Months ? "HK" : "Ragil");
    }, [watchIs12Months, watchMonthlyAmount, setValue]);

    const onSubmit = (data) => {
        const annualAmount = data.Is12Months ? data.MonthlyAmount * 12 : data.MonthlyAmount;

        const paymentData = {
            Mosad: "7013920",
            ApiValid: "zidFYCLaNi",
            Zeout: data.Zeout || "",
            FirstName: data.FirstName,
            LastName: data.LastName,
            Street: data.Street || "",
            City: data.City || "",
            Phone: data.Phone,
            Mail: data.Mail,
            PaymentType: data.Is12Months ? "HK" : "Ragil",
            Amount: annualAmount,
            Tashlumim: data.Is12Months ? 12 : data.Tashlumim,
            Currency: 1,
            Groupe: data.Groupe || "",
            Comment: data.Comment || "",
            CallBack: "https://node-beit-chabad-yaffo.onrender.com/api/nedarim-callback",
            CallBackMailError: "lchabadyaffo@gmail.com",
        };

        setPaymentData(paymentData); // שמירת הנתונים במצב
        setStep(2); // מעבר לשלב הבא
        setStatus("loading"); // עדכון המצב לטעינה
    };

    useEffect(() => {
        if (step === 2 && paymentData) {
            const iframe = iframeRef.current;
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage(paymentData, "*");
                setStatus("success"); // עדכון המצב להצלחה
            } else {
                setStatus("error"); // עדכון המצב לשגיאה
            }
        }
    }, [step, paymentData]);

    const handleBack = () => {
        setStep(1);
        setStatus("idle"); // איפוס המצב
    };

    const handlePayment = () => {
        const iframe = iframeRef.current;
        console.log('paymentData:', paymentData); // הוספנו את הודעת ה-Console כאן כדי לעקוב אחרי הנתונים
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(paymentData, "*");
            setStatus("success"); // עדכון המצב להצלחה
        } else {
            setStatus("error"); // עדכון המצב לשגיאה
        }
    };

    return (
        <div className="payment-form-container">
            <div className="step-indicator">
                <span className={step === 1 ? "active-step" : "inactive-step"}>1</span>
                <span> - </span>
                <span className={step === 2 ? "active-step" : "inactive-step"}>2</span>
            </div>
            {status === "loading" && <p>טוען...</p>}
            {status === "error" && <p>שגיאה בשליחת הנתונים. נסה שוב.</p>}
            {step === 1 && (
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
            {step === 2 && (
                <PaymentFormStep2
                    iframeRef={iframeRef}
                    handleBack={handleBack}
                    handlePayment={handlePayment}
                />
            )}
        </div>
    );
};

export default PaymentForm;