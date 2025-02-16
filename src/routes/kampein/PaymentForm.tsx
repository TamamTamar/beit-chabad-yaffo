import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./PaymentForm.scss";
import patterns from "../../validations/patterns";

const PaymentFormStep1 = ({
    register,
    handleSubmit,
    onSubmit,
    errors,
    watchMonthlyAmount,
    watchIs12Months,
    setValue,
}) => {
    const monthlyAmountRef = useRef(null);

    useEffect(() => {
        if (monthlyAmountRef.current) {
            monthlyAmountRef.current.focus();
        }
    }, []);

    const handleMonthlyAmountChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setValue("MonthlyAmount", parseFloat(value));
        }
    };

    const formatAmount = (amount) => {
        return amount.toLocaleString('en-US');
    };

    return (
        <div className="amount-info">
            <div className="amount-section">
                <div className="right-side-amount">
                    <div className="monthly-amount">
                        <p className="amount-text">תרומתך:</p>
                        <div className="monthly-amount-wrapper">
                            <input
                                type="text"
                                {...register("MonthlyAmount", {
                                    required: true,
                                    setValueAs: (value) => parseFloat(value) || 0,
                                })}
                                placeholder="סכום"
                                ref={monthlyAmountRef}
                                className="monthly-amount-input"
                                onChange={handleMonthlyAmountChange}
                                value={watchMonthlyAmount || ""}
                                maxLength={10} 
                            />
                            <div className="currency">₪</div>
                        </div>
                    </div>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            {...register("Is12Months")}
                            className="checkbox-input"
                        />
                        מאשר לחייב את כרטיס האשראי שלי כל חודש ₪{watchMonthlyAmount} כפול 12 חודשים, (סה"כ ₪{watchMonthlyAmount * 12})
                    </label>
                </div>
                <div className="left-side-amount">
                    <p className="amount-text">בית חב״ד יפו מקבל:</p>
                    <div className="for-year">₪
                        {isNaN(parseFloat(watchMonthlyAmount)) ? 0 : formatAmount(watchIs12Months ? parseFloat(watchMonthlyAmount) * 12 : parseFloat(watchMonthlyAmount))}
                    </div>
                </div>
            </div>
            <form className="payment-form" onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    {...register("FirstName", { required: true, maxLength: 50 })}
                    placeholder="שם פרטי"
                    className="form-input"
                />
                {errors.FirstName && <span className="error">נא להזין שם פרטי</span>}
                <input
                    type="text"
                    {...register("LastName", { required: true, maxLength: 50 })}
                    placeholder="שם משפחה"
                    className="form-input"
                />
                {errors.LastName && <span className="error">נא להזין שם משפחה</span>}
                <input
                    type="email"
                    {...register("Mail", {
                        required: true,
                        maxLength: 50,
                        pattern: patterns.email
                    })}
                    placeholder="אימייל"
                    className="form-input"
                />
                {errors.Mail && <span className="error">נא להזין אימייל</span>}
                <input
                    type="text"
                    {...register("Phone", {
                        required: true,
                        maxLength: 20,
                        pattern: patterns.phone
                    })}
                    placeholder="טלפון"
                    className="form-input"
                />
                {errors.Phone && <span className="error">נא להזין טלפון</span>}
                <input
                    type="text"
                    {...register("Dedication", { maxLength: 300 })}
                    placeholder="הקדשה (לא חובה)"
                    className="form-input"
                />
                <button type="submit" className="payment-button">המשך</button>
            </form>
        </div>
    );
};

const PaymentFormStep2 = ({ paymentData, onPaymentResponse }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            console.log("מקור ההודעה:", event.origin);  // מידע על מקור ההודעה
            console.log("תוכן ההודעה:", event.data);  // תוכן ההודעה עצמה
            
            if (event.origin !== "https://www.matara.pro") {
                console.warn("הודעה נדחתה - מקור לא מאושר:", event.origin);
                return;
            }
            
            if (event.source === iframeRef.current.contentWindow) {
                console.log("ההודעה התקבלה מה-iframe הנכון");
            } else {
                console.log("ההודעה לא הגיעה מה-iframe המצופה");
            }
            
        
            if (event.data && event.data.status) {
                onPaymentResponse(event.data);
                setPaymentStatus(event.data.status === "SUCCESS" ? "תשלום בוצע בהצלחה" : "שגיאה בתשלום");
            }

            if (event.data && event.data.type === "paymentDataReceived") {
                console.log("האייפרם קיבל את נתוני התשלום בהצלחה:", event.data);
            }
        };

        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [onPaymentResponse]);

    const sendPaymentData = () => {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
            console.log("שולח נתוני תשלום לאייפרם:", paymentData);
            iframe.contentWindow.postMessage(paymentData, "https://www.matara.pro");
            console.log("נתוני התשלום נשלחו בהצלחה");
        } else {
            console.error("האייפרם לא מוכן לקבל הודעות");
        }
    };

    return (
        <div className="payment-container">
            <iframe
                ref={iframeRef}
                title="NedarimPlus Payment"
                src="https://www.matara.pro/nedarimplus/iframe/"
                className="payment-iframe"
                onLoad={() => {
                    console.log("האייפרם נטען בהצלחה");
                    setIframeLoaded(true);
                }}
            />
            
            <button
                onClick={sendPaymentData}
                disabled={!iframeLoaded}
                className="payment-button"
            >
                שלח תשלום
            </button>

            {paymentStatus && <div className="payment-status">{paymentStatus}</div>}
        </div>
    );
};

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
            CallBack: "https://node-beit-chabad-yaffo.onrender.com/api/payment/nedarim",
            CallBackMailError: "lchabadyaffo@gmail.com",
        };

        setPaymentData(paymentData);
        setStep(2);
        setStatus("loading");
    };

    useEffect(() => {
        if (step === 2 && paymentData) {
            const iframe = iframeRef.current;
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage(paymentData, "*");
            } else {
                setStatus("error");
            }
        }
    }, [step, paymentData]);

    const handleBack = () => {
        setStep(1);
        setStatus("idle");
    };

    const handlePayment = async (response) => {
        if (response.status === "success") {
            setStatus("success");
            console.log("success paymentData", response);

            try {
                const serverResponse = await fetch("https://node-beit-chabad-yaffo.onrender.com/api/payment/nedarim", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(paymentData),
                });

                if (!serverResponse.ok) {
                    throw new Error("Network response was not ok");
                }

                const responseData = await serverResponse.json();
                console.log("Response from server:", responseData);
            } catch (error) {
                console.error("Error sending payment data to server:", error);
                setStatus("error");
            }
        } else {
            setStatus("error");
            console.log("error paymentData", response);
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
            {status === "success" && <p>העסקה הושלמה בהצלחה!</p>}
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
                    paymentData={paymentData}
                    onPaymentResponse={handlePayment}
                />
            )}
        </div>
    );
};

export default PaymentForm;