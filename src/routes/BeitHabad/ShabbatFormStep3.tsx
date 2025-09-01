import { useState } from "react";
import './ShabbatFormStep3.scss';


const CHILD_PRICE = 65;
const ADULT_PRICE = 80;
const COUPLE_PRICE = 150;

const ShabbatFormStep3 = ({ selectedShabbat, setStep, personalData, setPaymentData }) => {
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [couples, setCouples] = useState(0);

    const total =
        adults * ADULT_PRICE +
        children * CHILD_PRICE +
        couples * COUPLE_PRICE;

    const handleNext = () => {
        const PaymentData = {
            ...personalData,
            selectedShabbat,
            total,
            adults,
            children,
            couples,
        };

        const newPaymentData = {
            Mosad: "7013920",
            ApiValid: "zidFYCLaNi",
            Zeout: "",
            FirstName: PaymentData.firstname,
            LastName: PaymentData.lastname,
            Street: "",
            City: "",
            Phone: PaymentData.phone,
            Mail: PaymentData.mail,
            PaymentType: "Ragil",
            Amount: total,
            Tashlumim: 1,
            Currency: 1,
            Groupe: "",
            Comment: "רישום לשבת",
            CallBack: "https://node-beit-chabad-yaffo-production.up.railway.app/api/payment/payment-callback",
            CallBackMailError: "lchabadyaffo@gmail.com",
        };

        setPaymentData({
            apiData: newPaymentData,
            extraData: PaymentData
        });
        setStep(4);
    };

    return (
        <div className="shabbat-form">
            <h2 className="shabbat-form-title">
                רישום לשבת - {selectedShabbat?.parasha} ({selectedShabbat?.date})
            </h2>

            <div className="counter-row">
                <label className="form-label">מס' ילדים ({CHILD_PRICE} ₪ לילד):</label>
                <div className="counter-controls">
                    <button className="counter-btn" type="button" onClick={() => setChildren(Math.max(0, children - 1))}>-</button>
                    <span className="counter-value">{children}</span>
                    <button className="counter-btn" type="button" onClick={() => setChildren(children + 1)}>+</button>
                </div>
            </div>

            <div className="counter-row">
                <label className="form-label">מס' מבוגרים ({ADULT_PRICE} ₪ לאדם):</label>
                <div className="counter-controls">
                    <button className="counter-btn" type="button" onClick={() => setAdults(Math.max(0, adults - 1))}>-</button>
                    <span className="counter-value">{adults}</span>
                    <button className="counter-btn" type="button" onClick={() => setAdults(adults + 1)}>+</button>
                </div>
            </div>



            <div className="counter-row">
                <label className="form-label">מס' זוגות ({COUPLE_PRICE} ₪ לזוג):</label>
                <div className="counter-controls">
                    <button className="counter-btn" type="button" onClick={() => setCouples(Math.max(0, couples - 1))}>-</button>
                    <span className="counter-value">{couples}</span>
                    <button className="counter-btn" type="button" onClick={() => setCouples(couples + 1)}>+</button>
                </div>
            </div>

            <div className="total-display">
                <strong>סה"כ לתשלום: {total.toLocaleString()} ₪</strong>
            </div>
            <div className="form-actions">
                <button className="back-btn" type="button" onClick={() => setStep(2)}>חזור</button>
                <button className="next-btn" type="button" onClick={handleNext}>המשך</button>
            </div>
        </div>
    );
};

export default ShabbatFormStep3;