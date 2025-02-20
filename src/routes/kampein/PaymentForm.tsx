import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import PaymentFormStep1 from "./PaymentFormStep1";
import PaymentFormStep2 from "./PaymentFormStep2";
import "./PaymentForm.scss";

const PaymentForm = ({ monthlyAmount }) => {
    const [step, setStep] = useState(1);
    const [paymentData, setPaymentData] = useState(null);
    const [status, setStatus] = useState("idle");
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

    // עדכון שדות בעת שינוי חודשי או אפשרות 12 חודשים
    useEffect(() => {
        const monthlyAmountValue = parseFloat(watchMonthlyAmount) || 0;
        setValue("MonthlyAmount", monthlyAmountValue);
        setValue("PaymentType", watchIs12Months ? "HK" : "Ragil");
    }, [watchIs12Months, watchMonthlyAmount, setValue]);

    // שליחת הנתונים והמעבר לשלב הבא
    const onSubmit = (data) => {
        const annualAmount = data.Is12Months ? data.MonthlyAmount * 12 : data.MonthlyAmount;

        const paymentPayload = {
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

        setPaymentData(paymentPayload);
        setStep(2);
        setStatus("loading");
    };

    // מאזין לטעינת ה-iframe – שולח את הנתונים כשהוא מוכן
    useEffect(() => {
        const iframe = iframeRef.current;

        const handleIframeLoad = () => {
            if (iframe && iframe.contentWindow && paymentData) {
                iframe.contentWindow.postMessage(paymentData, "https://www.matara.pro");
                setStatus("success");
            } else {
                setStatus("error");
            }
        };

        if (iframe) {
            iframe.addEventListener("load", handleIframeLoad);
        }

        return () => {
            if (iframe) {
                iframe.removeEventListener("load", handleIframeLoad);
            }
        };
    }, [paymentData]);

    // טיפול בלחיצה על "בצע תשלום" – שולח את הנתונים ל-iframe
    const handlePayment = () => {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow && paymentData) {
            iframe.contentWindow.postMessage(paymentData, "https://www.matara.pro");
        } else {
            setStatus("error");
        }
    };

    const handleBack = () => {
        setStep(1);
        setStatus("idle");
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
