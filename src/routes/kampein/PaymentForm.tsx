import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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
            MonthlyAmount: initialAmount, // Set it as a number, not formatted string
            Is12Months: initialAmount !== 0,
        }
    });

    const watchIs12Months = watch("Is12Months");
    const watchMonthlyAmount = watch("MonthlyAmount");
    const watchTashlumim = watch("Tashlumim");

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

    const onSubmit = async (data) => {
        const annualAmount = data.Is12Months ? data.MonthlyAmount * 12 : data.MonthlyAmount;

        // יצירת אובייקט חדש עם רק השדות הנדרשים
        const paymentData = {
            Mosad: "7013920",  // מזהה מוסד בנדרים פלוס
            ApiValid: "zidFYCLaNi",  // טקסט אימות
            Zeout: data.Zeout || "",  // תעודת זהות
            FirstName: data.FirstName,
            LastName: data.LastName,
            Street: data.Street || "",
            City: data.City || "",
            Phone: data.Phone,
            Mail: data.Mail,
            PaymentType: data.Is12Months ? "HK" : "Ragil",  // סוג תשלום
            Amount: annualAmount,
            Tashlumim: data.Is12Months ? 12 : data.Tashlumim,  // מספר חודשים לתשלום
            Currency: 1,  // מטבע
            Groupe: data.Groupe || "",
            Comment: data.Comment || "",
            CallBack: "https://yourdomain.com/api/nedarim-callback",
            CallBackMailError: "lchabadyaffo@gmail.com",
        };

        console.log("Submitting to API:", paymentData);

        setLoading(true);
        setErrorMessage(""); // Clear previous errors

       try {
            // Send data to your API endpoint
            const response = await axios.post("https://www.matara.pro/nedarimplus/iframe/", paymentData);

            if (response.status === 200) {
                console.log("API Response:", response.data);
                setStep(2); // Go to the payment iframe

                // Once the API response is successful, send data to iframe
                const iframe = iframeRef.current;
                iframe.contentWindow.postMessage(paymentData, "*");

            } else {
                setErrorMessage("Something went wrong. Please try again later.");
            }
        } catch (error) {
            console.error("Error during API request:", error);
            setErrorMessage("There was an error processing your payment. Please try again later.");
        } finally {
            setLoading(false); // Reset loading state
        } 
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleMonthlyAmountChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            // מעדכנים את הערך ב-form בצורה נכונה
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
                                    type="text" // נשנה ל-type="text" על מנת להציג את הערך כ-string
                                    {...register("MonthlyAmount", {
                                        required: true,
                                        setValueAs: (value) => parseFloat(value) || 0, // המרה בעת שליחת הערך
                                    })}
                                    placeholder="סכום"
                                    ref={monthlyAmountRef}
                                    className="monthly-amount-input"
                                    onChange={handleMonthlyAmountChange}
                                    value={watchMonthlyAmount || ""} // נשתמש ב-watch כדי לשמור את הערך כ-string
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