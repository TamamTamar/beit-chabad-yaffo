import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { RishumShabbatInput } from "../../@Types/chabadType";

const ADULT_PRICE = 1;
const CHILD_PRICE = 25;
const COUPLE_PRICE = 90;

const ShabbatFormStep2 = ({ selectedShabbat, setStep, setPaymentData }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            firstname: "",
            lastname: "",
            phone: "",
            mail: "",
        }
    });

    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);
    const [couples, setCouples] = useState(0);

    const total =
        adults * ADULT_PRICE +
        children * CHILD_PRICE +
        couples * COUPLE_PRICE;

    const onSubmit = (data: RishumShabbatInput) => {
        const PaymentData = {
            ...data,
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
            Mail: data.mail,
            PaymentType: "Ragil",
            Amount: total,
            Tashlumim: 1,
            Currency: 1,
            Groupe: "",
            Comment: "",
            CallBack: "https://node-beit-chabad-yaffo.onrender.com/api/payment/payment-callback",
            CallBackMailError: "lchabadyaffo@gmail.com",
        };

        console.log("Selected Shabbat:", selectedShabbat);
        console.log("Form Data:", data);
        console.log("Total Payment:", total);

        setPaymentData(newPaymentData);
        setStep(3);
    };

    return (
        <div className="shabbat-form">
            <h2>רישום לשבת - {selectedShabbat?.parasha} ({selectedShabbat?.date})</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="firstname">שם פרטי:</label>
                    <input
                        id="firstname"
                        type="text"
                        {...register("firstname", { required: "נא להזין שם פרטי" })}
                        placeholder="הכנס שם פרטי"
                    />
                    {errors.firstname && <span className="error">{errors.firstname.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="lastname">שם משפחה:</label>
                    <input
                        id="lastname"
                        type="text"
                        {...register("lastname", { required: "נא להזין שם משפחה" })}
                        placeholder="הכנס שם משפחה"
                    />
                    {errors.lastname && <span className="error">{errors.lastname.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="phone">טלפון:</label>
                    <input
                        id="phone"
                        type="text"
                        {...register("phone", {
                            required: "נא להזין מספר טלפון",
                            pattern: {
                                value: /^[0-9]{9,10}$/,
                                message: "נא להזין מספר טלפון תקין",
                            },
                        })}
                        placeholder="הכנס מספר טלפון"
                    />
                    {errors.phone && <span className="error">{errors.phone.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="mail">אימייל:</label>
                    <input
                        id="mail"
                        type="email"
                        {...register("mail", {
                            required: "נא להזין כתובת אימייל",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "נא להזין כתובת אימייל תקינה",
                            },
                        })}
                        placeholder="הכנס כתובת אימייל"
                    />
                    {errors.mail && <span className="error">{errors.mail.message}</span>}
                </div>

                <div className="counter-row">
                    <label>מס' מבוגרים ({ADULT_PRICE} ₪ לאדם):</label>
                    <div className="counter-controls">
                        <button type="button" onClick={() => setAdults(Math.max(0, adults - 1))}>-</button>
                        <span>{adults}</span>
                        <button type="button" onClick={() => setAdults(adults + 1)}>+</button>
                    </div>
                </div>

                <div className="counter-row">
                    <label>מס' ילדים ({CHILD_PRICE} ₪ לילד):</label>
                    <div className="counter-controls">
                        <button type="button" onClick={() => setChildren(Math.max(0, children - 1))}>-</button>
                        <span>{children}</span>
                        <button type="button" onClick={() => setChildren(children + 1)}>+</button>
                    </div>
                </div>

                <div className="counter-row">
                    <label>מס' זוגות ({COUPLE_PRICE} ₪ לזוג):</label>
                    <div className="counter-controls">
                        <button type="button" onClick={() => setCouples(Math.max(0, couples - 1))}>-</button>
                        <span>{couples}</span>
                        <button type="button" onClick={() => setCouples(couples + 1)}>+</button>
                    </div>
                </div>

                <div className="total-display">
                    <strong>סה"כ לתשלום: {total.toLocaleString()} ₪</strong>
                </div>
                <button type="button" onClick={() => setStep(1)}>חזור</button>
                <button type="submit">המשך</button>
            </form>
        </div>
    );
};

export default ShabbatFormStep2;