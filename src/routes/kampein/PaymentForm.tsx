import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import "./PaymentForm.scss";

const PaymentForm = ({ monthlyAmount }) => {
    const [step, setStep] = useState(1);
    const iframeRef = useRef(null);
    const monthlyAmountRef = useRef(null);
    const initialAmount = monthlyAmount || 0;

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            Mosad: "7013920",
            ApiValid: "zidFYCLaNi",
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
            MonthlyAmount: initialAmount, // Set it as a number, not formatted string
            Is12Months: initialAmount !== 0,
        }
    });

    const watchIs12Months = watch("Is12Months");
    const watchMonthlyAmount = watch("MonthlyAmount");

    // עדכון הערכים ב-useEffect
    useEffect(() => {
        const monthlyAmountValue = parseFloat(watchMonthlyAmount) || 0;
        setValue("MonthlyAmount", monthlyAmountValue); // להבטיח שהערך בפורמט נכון
        setValue("PaymentType", watchIs12Months ? "HK" : "Ragil");

        console.log("MonthlyAmount:", watchMonthlyAmount);
    

    }, [watchIs12Months, watchMonthlyAmount, setValue, initialAmount]);

    useEffect(() => {
        if (monthlyAmountRef.current) {
            monthlyAmountRef.current.focus();
        }
    }, []);

    const onSubmit = (data) => {
        const annualAmount = data.Is12Months ? data.MonthlyAmount * 12 : data.MonthlyAmount; // חישוב הסכום השנתי לפי הצ'קבוקס
        const paymentData = {
            ...data,
            Amount: annualAmount, // נשלח את הסכום הנכון (חודשי או שנתי)
        };
        console.log("נתונים שנשלחים ל-API:", paymentData);
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleMonthlyAmountChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            // מעדכנים את הערך ב-form בצורה נכונה
            setValue("MonthlyAmount", parseFloat(parseFloat(value).toFixed(2)));
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
                                    type="number"
                                    step="0.01"
                                    {...register("MonthlyAmount", { required: true })}
                                    placeholder="סכום"
                                    ref={monthlyAmountRef}
                                    className="monthly-amount-input"
                                    onChange={handleMonthlyAmountChange}
                                    value={watchMonthlyAmount || ""} // Use watch for value
                                />{" "}
                                ₪
                            </p>
                            {errors.MonthlyAmount && <span className="error">נא להזין סכום חוקי</span>}
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    {...register("Is12Months")}
                                    className="checkbox-input"
                                />
                                12 חודשים
                            </label>
                        </div>
                        <div className="left-side-amount">
                            <p>בית חב״ד יפו מקבל: {isNaN(parseFloat((watchMonthlyAmount * (watchIs12Months ? 12 : 1)).toString())) ? 0 : (watchMonthlyAmount * (watchIs12Months ? 12 : 1))} ₪</p>
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
                            type="text"
                            {...register("Street", { maxLength: 100 })}
                            placeholder="רחוב"
                            className="form-input"
                        />
                        <input
                            type="text"
                            {...register("City", { maxLength: 100 })}
                            placeholder="עיר"
                            className="form-input"
                        />
                        <input
                            type="email"
                            {...register("Mail", { required: true, maxLength: 50 })}
                            placeholder="אימייל"
                            className="form-input"
                        />
                        {errors.Mail && <span className="error">נא להזין אימייל</span>}
                        <input
                            type="text"
                            {...register("Phone", { required: true, maxLength: 20, pattern: /^\d+$/ })}
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
