import React, { useState, useEffect, useRef } from "react";
import "./PaymentForm.scss";

const PaymentForm = ({ amount }) => {
    const iframeRef = useRef(null);
    const monthlyAmountRef = useRef(null);
    const initialAmount = amount || 0;

    const [formData, setFormData] = useState({
        Zeout: "",
        FirstName: "",
        LastName: "",
        Phone: "",
        Mail: "",
        Dedication: "",
        PaymentType: "Ragil", // סוג תשלום ברירת מחדל - רגיל
        MonthlyAmount: initialAmount,
        AnnualAmount: initialAmount * 12,
        Is12Months: initialAmount !== 0,
    });

    const [step, setStep] = useState(1);

    useEffect(() => {
        if (formData.Is12Months) {
            setFormData((prevState) => ({
                ...prevState,
                AnnualAmount: prevState.MonthlyAmount * 12,
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                AnnualAmount: prevState.MonthlyAmount,
            }));
        }
    }, [formData.Is12Months, formData.MonthlyAmount]);

    useEffect(() => {
        if (monthlyAmountRef.current) {
            monthlyAmountRef.current.focus();
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
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
                                    name="MonthlyAmount"
                                    value={formData.MonthlyAmount}
                                    onChange={handleChange}
                                  
                                    ref={monthlyAmountRef}
                                    className="monthly-amount-input"
                                />{" "}
                                ₪
                            </p>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="Is12Months"
                                    checked={formData.Is12Months}
                                    onChange={handleChange}
                                    className="checkbox-input"
                                />
                                12 חודשים
                            </label>
                        </div>
                        <div className="left-side-amount">
                            <p>בית חב״ד יפו מקבל: {formData.AnnualAmount} ₪</p>
                        </div>
                    </div>
                    <form className="payment-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="FirstName"
                            value={formData.FirstName}
                            onChange={handleChange}
                            placeholder="שם פרטי"
                            required
                            className="form-input"
                        />
                        <input
                            type="text"
                            name="LastName"
                            value={formData.LastName}
                            onChange={handleChange}
                            placeholder="שם משפחה"
                            required
                            className="form-input"
                        />
                        <input
                            type="email"
                            name="Mail"
                            value={formData.Mail}
                            onChange={handleChange}
                            placeholder="אימייל"
                            required
                            className="form-input"
                        />
                        <input
                            type="text"
                            name="Phone"
                            value={formData.Phone}
                            onChange={handleChange}
                            placeholder="טלפון"
                            required
                            className="form-input"
                        />
                        <input
                            type="text"
                            name="Dedication"
                            value={formData.Dedication}
                            onChange={handleChange}
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
