import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./PaymentForm.scss";

const PaymentForm = () => {
    const location = useLocation();
    const iframeRef = useRef(null);
    const monthlyAmountRef = useRef(null);
    const initialAmount = location.state?.amount || 0;

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

      return (
        <div className="payment-form-container">
            {step === 1 && (
                <div className="amount-info">
                    <p>
                        סכום חודשי:
                        <input
                            type="number"
                            name="MonthlyAmount"
                            value={formData.MonthlyAmount}
                            onChange={handleChange}
                            placeholder="סכום חודשי"
                            ref={monthlyAmountRef}
                        />{" "}
                        ₪
                    </p>
                    <p>בית חב״ד יפו מקבל: {formData.AnnualAmount} ₪</p>
                    <label>
                        <input
                            type="checkbox"
                            name="Is12Months"
                            checked={formData.Is12Months}
                            onChange={handleChange}
                        />
                        12 חודשים
                    </label>
                    <form className="payment-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="FirstName"
                            value={formData.FirstName}
                            onChange={handleChange}
                            placeholder="שם פרטי"
                            required
                        />
                        <input
                            type="text"
                            name="LastName"
                            value={formData.LastName}
                            onChange={handleChange}
                            placeholder="שם משפחה"
                            required
                        />
                        <input
                            type="email"
                            name="Mail"
                            value={formData.Mail}
                            onChange={handleChange}
                            placeholder="אימייל"
                            required
                        />
                        <input
                            type="text"
                            name="Phone"
                            value={formData.Phone}
                            onChange={handleChange}
                            placeholder="טלפון"
                            required
                        />
                        <input
                            type="text"
                            name="Dedication"
                            value={formData.Dedication}
                            onChange={handleChange}
                            placeholder="הקדשה (לא חובה)"
                        />
                        <button type="submit">המשך</button>
                    </form>
                </div>
            )}
            {step === 2 && (
                <iframe
                    ref={iframeRef}
                    title="NedarimPlus Payment"
                    src="https://www.matara.pro/nedarimplus/iframe/"
                    style={{ width: "100%", height: "600px", border: "none", marginTop: "20px" }}
                ></iframe>
            )}
        </div>
    );
};

export default PaymentForm;