import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './PaymentForm.scss';

const PaymentForm = ({ }) => {
    const location = useLocation();
    const initialAmount = location.state?.amount || 0;

    const [formData, setFormData] = useState({
        Zeout: "",
        FirstName: "",
        LastName: "",
        Phone: "",
        Mail: "",
        Dedication: "",
        PaymentType: "credit",
        MonthlyAmount: initialAmount,
        AnnualAmount: initialAmount * 12,
        Is12Months: initialAmount !== 0,
    });

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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
    };

    return (
        <div className="payment-form-container">
            <div className="amount-info">
                <p>סכום חודשי: 
                    <input
                        type="number"
                        name="MonthlyAmount"
                        value={formData.MonthlyAmount}
                        onChange={handleChange}
                        placeholder="סכום חודשי"
                    /> ₪
                </p>
                <p>סכום שנתי: {formData.AnnualAmount} ₪</p>
                <label>
                    <input
                        type="checkbox"
                        name="Is12Months"
                        checked={formData.Is12Months}
                        onChange={handleChange}
                    />
                    12 חודשים
                </label>
            </div>
            <form className="payment-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={handleChange}
                    placeholder="שם פרטי"
                    maxLength={50}
                    required
                />
                <input
                    type="text"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleChange}
                    placeholder="שם משפחה"
                    maxLength={50}
                    required
                />
                <input
                    type="email"
                    name="Mail"
                    value={formData.Mail}
                    onChange={handleChange}
                    placeholder="אימייל"
                    maxLength={50}
                    required
                />
                <input
                    type="text"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleChange}
                    placeholder="טלפון"
                    maxLength={10}
                    pattern="[0-9]*"
                    required
                />
                <input
                    type="text"
                    name="Dedication"
                    value={formData.Dedication}
                    onChange={handleChange}
                    placeholder="הקדשה (לא חובה)"
                    maxLength={100}
                />
                <select name="PaymentType" value={formData.PaymentType} onChange={handleChange}>
                    <option value="credit">אשראי</option>
                    <option value="bit">ביט</option>
                </select>
                <button type="submit">בצע תשלום</button>
            </form>
        </div>
    );
};

export default PaymentForm;