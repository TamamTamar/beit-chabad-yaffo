import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './PaymentForm.scss';

const PaymentForm = ({  }) => {
    const location = useLocation();
    const initialAmount = location.state?.amount || "";

    const [formData, setFormData] = useState({
        Mosad: "7013920",
        ApiValid: "zidFYCLaNi",
        Zeout: "",
        FirstName: "",
        LastName: "",
        Street: "",
        City: "",
        Phone: "",
        Mail: "",
        PaymentType: "",
        Amount: initialAmount,
        Tashlumim: "",
        Currency: "1",
        Groupe: "",
        Comment: "",
        CallBack: "https://yourserver.com/callback",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const calculateMonthlyAmount = () => {
        const amount = parseFloat(formData.Amount) || 0;
        const months = parseInt(formData.Tashlumim) || 1;
        return months > 0 ? (amount / months).toFixed(2) : "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
    };

    return (
        <form className="payment-form" onSubmit={handleSubmit}>
            <input
                type="text"
                name="Zeout"
                value={formData.Zeout}
                onChange={handleChange}
                placeholder="תעודת זהות"
                maxLength={9}
                required
            />
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
                type="text"
                name="Street"
                value={formData.Street}
                onChange={handleChange}
                placeholder="רחוב"
                maxLength={100}
            />
            <input
                type="text"
                name="City"
                value={formData.City}
                onChange={handleChange}
                placeholder="עיר"
                maxLength={50}
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
                type="email"
                name="Mail"
                value={formData.Mail}
                onChange={handleChange}
                placeholder="אימייל"
                maxLength={50}
            />

            <select name="PaymentType" value={formData.PaymentType} onChange={handleChange}>
                <option value="">בחר סוג תשלום</option>
                <option value="Ragil">רגיל</option>
                <option value="HK">חיוב חודשי</option>
                <option value="CreateToken">יצירת טוקן</option>
            </select>

            {formData.PaymentType === "Ragil" && (
                <input
                    type="number"
                    name="Tashlumim"
                    value={formData.Tashlumim}
                    onChange={handleChange}
                    placeholder="מספר תשלומים (1 ומעלה)"
                    min="1"
                    required
                />
            )}

            {formData.PaymentType === "HK" && (
                <>
                    <input
                        type="number"
                        name="Tashlumim"
                        value={formData.Tashlumim}
                        onChange={handleChange}
                        placeholder="מספר חודשים (ריק לחיוב ללא הגבלה)"
                    />
                    <input
                        type="text"
                        value={calculateMonthlyAmount()}
                        readOnly
                        placeholder="סכום חודשי"
                    />
                </>
            )}

            {formData.PaymentType === "CreateToken" && (
                <iframe
                    src="https://www.matara.pro/nedarimplus/iframe/?Tokef=Hide&CVV=Hide"
                    width="100%"
                    height="400px"
                    frameBorder="0">
                </iframe>
            )}

            <input
                type="number"
                name="Amount"
                value={formData.Amount}
                onChange={handleChange}
                placeholder="סכום"
                required
            />
            <button type="submit">בצע תשלום</button>
        </form>
    );
};

export default PaymentForm;
