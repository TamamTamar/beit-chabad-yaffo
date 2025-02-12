import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { submitPaymentData } from "../../services/payment-service";
import "./PaymentForm.scss";
import patterns from "../../validations/patterns";

const PaymentForm = ({ monthlyAmount }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const iframeRef = useRef(null);
    const monthlyAmountRef = useRef(null);
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
    const watchTashlumim = watch("Tashlumim");

    useEffect(() => {
        const monthlyAmountValue = parseFloat(watchMonthlyAmount) || 0;
        setValue("MonthlyAmount", monthlyAmountValue);
        setValue("PaymentType", watchIs12Months ? "HK" : "Ragil");
    }, [watchIs12Months, watchMonthlyAmount, setValue]);

    useEffect(() => {
        if (monthlyAmountRef.current) {
            monthlyAmountRef.current.focus();
        }
    }, []);

    const onSubmit = async (data) => {
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

        setLoading(true);
        setErrorMessage("");

        try {
            const response = await submitPaymentData(paymentData);

            if (response.status === 200) {
                setStep(2);
                const iframe = iframeRef.current;
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage(paymentData, "*");
                }
            } else {
                setErrorMessage("Something went wrong. Please try again later.");
            }
        } catch (error) {
            setErrorMessage("There was an error processing your payment. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleMonthlyAmountChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setValue("MonthlyAmount", parseFloat(value));
        }
    };

    return (
        <div className="payment-form-container">
            <div className="step-indicator">
                <span className={step === 1 ? "active-step" : "inactive-step"}>1</span>
                <span> - </span>
                <span className={step === 2 ? "active-step" : "inactive-step"}>2</span>
            </div>
            {step === 1 && (
                <div className="amount-info">
                    <div className="amount-section">
                        <div className="right-side-amount">
                            <p className="monthly-amount"> תרומתך:
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
                                />
                                {" "}
                                ₪
                            </p>
                            {errors.MonthlyAmount && <span className="error">נא להזין סכום חוקי</span>}
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    {...register("Is12Months")}
                                    className="checkbox-input"
                                />
                               מאשר לחייב את כרטיס האשראי שלי כל חודש ₪{watchMonthlyAmount} כפול 12 חודשים, (סה"כ ₪{watchMonthlyAmount * 12})
                            </label>
                            {!watchIs12Months && (
                                <div>
                                    <label htmlFor="Tashlumim">מספר תשלומים:</label>
                                    <select
                                        id="Tashlumim"
                                        {...register("Tashlumim", { required: true })}
                                        defaultValue={1}
                                    >
                                        {[...Array(11).keys()].map(i => (
                                            <option key={i + 2} value={i + 2}>
                                                {i + 2} תשלומים - {(watchMonthlyAmount / (i + 2)).toFixed(2)} ₪ לחודש
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="left-side-amount">
                            <p>בית חב״ד יפו מקבל: {isNaN(parseFloat(watchMonthlyAmount)) ? 0 : (watchIs12Months ? parseFloat(watchMonthlyAmount) * 12 : parseFloat(watchMonthlyAmount))} ₪</p>
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
                        <button type="submit" className="submit-button">המשך</button>
                    </form>
                </div>
            )}
            {step === 2 && (
                <div className="iframe-container">
                    <h2 className="payment-title">תשלום</h2>
                    <iframe
                        ref={iframeRef}
                        title="NedarimPlus Payment"
                        src="https://www.matara.pro/nedarimplus/iframe/"
                        className="payment-iframe"
                    ></iframe>
                    <button className="back-button" onClick={handleBack}>הקודם</button>
                </div>
            )}
        </div>
    );
};

export default PaymentForm;
