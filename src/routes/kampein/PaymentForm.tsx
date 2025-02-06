import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import "./PaymentForm.scss";

const PaymentForm = ({ amount }) => {
    const iframeRef = useRef(null);
    const monthlyAmountRef = useRef(null);
    const initialAmount = amount || 0;

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            Zeout: "",
            FirstName: "",
            LastName: "",
            Phone: "",
            Mail: "",
            Dedication: "",
            PaymentType: "Ragil",
            MonthlyAmount: initialAmount,
            AnnualAmount: initialAmount * 12,
            Is12Months: initialAmount !== 0,
        }
    });

    const watchIs12Months = watch("Is12Months");
    const watchMonthlyAmount = watch("MonthlyAmount");

    useEffect(() => {
        if (watchIs12Months) {
            setValue("AnnualAmount", watchMonthlyAmount * 12);
        } else {
            setValue("AnnualAmount", watchMonthlyAmount);
        }
    }, [watchIs12Months, watchMonthlyAmount, setValue]);

    useEffect(() => {
        if (monthlyAmountRef.current) {
            monthlyAmountRef.current.focus();
        }
    }, []);

    const onSubmit = (data) => {
        console.log(data);
        // Handle form submission
    };

    return (
        <div className="payment-form-container">
            <div className="step-indicator">
                <span className="active-step">1</span>
                <span> - </span>
                <span>2</span>
            </div>
            <div className="amount-info">
                <div className="amount-section">
                    <div className="right-side-amount">
                        <p>
                            סכום חודשי:
                            <div className="input-container">
                                <input
                                    type="text"
                                    {...register("MonthlyAmount", { required: true, pattern: /^\d*$/ })}
                                    ref={monthlyAmountRef}
                                    className="monthly-amount-input"
                                    placeholder="סכום חודשי"
                                />
                                <span className="currency">₪</span>
                            </div>
                            {errors.MonthlyAmount && <span className="error">נא להזין סכום חוקי</span>}
                        </p>
                        <label>
                            <input
                                type="checkbox"
                                {...register("Is12Months")}
                            />
                            12 חודשים
                        </label>
                    </div>
                    <div className="left-side-amount">
                        <p>בית חב״ד יפו מקבל: {watch("AnnualAmount")} ₪</p>
                    </div>
                </div>
                <form className="payment-form" onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="text"
                        {...register("FirstName", { required: true })}
                        placeholder="שם פרטי"
                        className="form-input"
                    />
                    {errors.FirstName && <span className="error">נא להזין שם פרטי</span>}
                    <input
                        type="text"
                        {...register("LastName", { required: true })}
                        placeholder="שם משפחה"
                        className="form-input"
                    />
                    {errors.LastName && <span className="error">נא להזין שם משפחה</span>}
                    <input
                        type="email"
                        {...register("Mail", { required: true })}
                        placeholder="אימייל"
                        className="form-input"
                    />
                    {errors.Mail && <span className="error">נא להזין אימייל</span>}
                    <input
                        type="text"
                        {...register("Phone", { required: true })}
                        placeholder="טלפון"
                        className="form-input"
                    />
                    {errors.Phone && <span className="error">נא להזין טלפון</span>}
                    <input
                        type="text"
                        {...register("Dedication")}
                        placeholder="הקדשה (לא חובה)"
                        className="form-input"
                    />
                    <button type="submit">המשך</button>
                </form>
            </div>
        </div>
    );
};

export default PaymentForm;