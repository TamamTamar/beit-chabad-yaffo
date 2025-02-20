import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import PaymentFormStep1 from "./PaymentFormStep1";
import PaymentFormStep2 from "./PaymentFormStep2";
import "./PaymentForm.scss";

const PaymentForm = ({ monthlyAmount }) => {
    const [step, setStep] = useState(1);
    const [paymentData, setPaymentData] = useState(null);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
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
            Amount: monthlyAmount || 0,
            Tashlumim: 1,
            Currency: 1,
            Groupe: "",
            Comment: "",
            Dedication: "",
            PaymentType: "Ragil",
            MonthlyAmount: monthlyAmount || 0,
            Is12Months: (monthlyAmount || 0) !== 0,
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
        const annualAmount = data.Is12Months ? data.MonthlyAmount * 12 : data.MonthlyAmount;

        const newPaymentData = {
            Mosad: "7013920",
            ApiValid: "zidFYCLaNi",
            Zeout: data.Zeout,
            FirstName: data.FirstName,
            LastName: data.LastName,
            Street: data.Street,
            City: data.City,
            Phone: data.Phone,
            Mail: data.Mail,
            PaymentType: data.Is12Months ? "HK" : "Ragil",
            Amount: annualAmount,
            Tashlumim: data.Is12Months ? 12 : data.Tashlumim,
            Currency: 1,
            Groupe: data.Groupe,
            Comment: data.Comment,
            CallBack: "https://node-beit-chabad-yaffo.onrender.com/api/nedarim-callback",
            CallBackMailError: "lchabadyaffo@gmail.com",
        };

        setPaymentData(newPaymentData);
        setStep(2);
        setStatus("loading");
    };

    const handleIframeMessage = useCallback(async (event: MessageEvent) => {
        // אבטחה: בדיקה שההודעה מגיעה מהכתובת הנכונה
        if (event.origin !== "https://www.matara.pro") return;

        const { data } = event;

        console.log("📥 הודעה מה-iframe:", data);

        if (data.status === "success") {
            try {
                const serverResponse = await fetch("https://node-beit-chabad-yaffo.onrender.com/api/payment/nedarim", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(paymentData),
                });

                if (!serverResponse.ok) throw new Error("Network response was not ok");

                const responseData = await serverResponse.json();
                console.log("✅ תגובה מהשרת:", responseData);
                setStatus("success");
            } catch (error) {
                console.error("❌ שגיאה בשליחת נתוני תשלום לשרת:", error);
                setStatus("error");
            }
        } else {
            console.warn("⚠️ עסקה נכשלה או בוטלה:", data);
            setStatus("error");
        }
    }, [paymentData]);

    useEffect(() => {
        window.addEventListener("message", handleIframeMessage);
        return () => window.removeEventListener("message", handleIframeMessage);
    }, [handleIframeMessage]);

    const handleBack = () => {
        setStep(1);
        setStatus("idle");
    };

    const handlePayment = () => {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(paymentData, "https://www.matara.pro/nedarimplus/iframe/");
            console.log("🚀 נתוני תשלום נשלחו ל-iframe:", paymentData);
        } else {
            console.error("⚠️ לא ניתן לשלוח הודעה ל-iframe.");
            setStatus("error");
        }
    };

    return (
        <div className="payment-form-container">
            <div className="step-indicator">
                <span className={step === 1 ? "active-step" : "inactive-step"}>1</span>
                <span> - </span>
                <span className={step === 2 ? "active-step" : "inactive-step"}>2</span>
            </div>

            {status === "loading" && <p>🔄 טוען...</p>}
            {status === "error" && <p>❌ שגיאה בשליחת הנתונים. נסה שוב.</p>}
            {status === "success" && <p>✅ התשלום בוצע בהצלחה!</p>}

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
                    paymentData={paymentData}
                />
            )}
        </div>
    );
};

export default PaymentForm;
