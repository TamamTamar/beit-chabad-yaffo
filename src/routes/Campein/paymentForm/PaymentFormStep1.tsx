import { useEffect, useRef } from "react";
import patterns from "../../../validations/patterns";

const PaymentFormStep1 = ({
    register,
    handleSubmit,
    onSubmit,
    errors,
    watchMonthlyAmount,
    watchIs12Months,
    setValue,
}) => {
    const monthlyAmountRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (monthlyAmountRef.current) {
            monthlyAmountRef.current.focus();
        }
    }, []);

    const handleMonthlyAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setValue("MonthlyAmount", parseFloat(value));
        }
    };

    const formatCurrency = (amount: number) =>
        amount.toLocaleString("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 });

    return (
        <div className="amount-info">
            <div className="amount-section">
                <div className="right-side-amount">
                    <div className="monthly-amount">
                        <p className="amount-text">תרומתך:</p>
                        <div className="monthly-amount-wrapper">
                            <input
                                type="text"
                                {...register("MonthlyAmount", {
                                    required: true,
                                    min: 1,
                                    setValueAs: (value: string) => parseFloat(value) || 0,
                                })}
                                placeholder="סכום"
                                ref={monthlyAmountRef}
                                className="monthly-amount-input"
                                onChange={handleMonthlyAmountChange}
                                value={watchMonthlyAmount || ""}
                                maxLength={10}
                            />
                        </div>
                    </div>

                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            {...register("Is12Months")}
                            className="checkbox-input"
                        />
                        מאשר/ת לחייב את כרטיס האשראי שלי כל חודש ₪{watchMonthlyAmount || 0} כפול 12 חודשים,
                        (סה&quot;כ ₪{(Number(watchMonthlyAmount) || 0) * 12})
                    </label>

                    {!watchIs12Months && (
                        <div className="tashlumim-section">
                            <label className="checkbox-label" htmlFor="Tashlumim">מספר תשלומים:</label>
                            <select
                                className="tashlumim-select"
                                id="Tashlumim"
                                {...register("Tashlumim", { required: true })}
                                defaultValue={1}
                            >
                                <option value={1}>תשלום אחד - {watchMonthlyAmount || 0} ₪</option>
                                {[...Array(11).keys()].map((i) => (
                                    <option key={i + 2} value={i + 2}>
                                        {i + 2} תשלומים - {((Number(watchMonthlyAmount) || 0) / (i + 2)).toFixed(2)} ₪ לחודש
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="left-side-amount">
                    <p className="amount-text">בית חב״ד יפו מקבל:</p>
                    <div className="for-year">
                        {isNaN(parseFloat(watchMonthlyAmount))
                            ? formatCurrency(0)
                            : formatCurrency(
                                (watchIs12Months
                                    ? parseFloat(watchMonthlyAmount) * 12
                                    : parseFloat(watchMonthlyAmount)) || 0
                            )}
                    </div>
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
                        pattern: patterns.email,
                    })}
                    placeholder="אימייל"
                    className="form-input"
                />
                {errors.Mail && <span className="error">נא להזין אימייל חוקי</span>}

                <input
                    type="text"
                    {...register("Phone", {
                        required: true,
                        maxLength: 20,
                        pattern: patterns.phone,
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

                {/* חדש: תצוגה אנונימית ברשימת התורמים */}
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        {...register("DisplayAsAnonymous")}
                        className="checkbox-input"
                    />
                    הצג אותי כתורם/ת אנונימי/ת ברשימת התורמים
                </label>
                <p className="hint">
                    נשתמש בשם שלך לצורכי קבלה/קבלה מס, אבל ברשימת התורמים באתר יוצג "תורם/ת אנונימי/ת".
                </p>

                <button type="submit" className="payment-button">המשך</button>
            </form>
        </div>
    );
};

export default PaymentFormStep1;
