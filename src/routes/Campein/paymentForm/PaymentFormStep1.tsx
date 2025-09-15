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
    watch,
}) => {
    const monthlyAmountRef = useRef<HTMLInputElement | null>(null);

    // נועל/משחרר תשלומים לפי מצב HK
    useEffect(() => {
        if (watchIs12Months) setValue("Tashlumim", 1); // HK תמיד תשלום אחד
    }, [watchIs12Months, setValue]);

    useEffect(() => {
        monthlyAmountRef.current?.focus();
    }, []);

    // קלט מספרי בלבד; ממפה לשדה המתאים לפי מצב התשלום
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(",", ".");
        if (/^\d*\.?\d*$/.test(value)) {
            const num = parseFloat(value) || 0;
            if (watchIs12Months) {
                setValue("MonthlyAmount", num);
            } else {
                setValue("Amount", num);
                setValue("MonthlyAmount", num);
            }
        }
    };

    // בחירת מטבע: 1=שקל, 2=דולר
    const currency = Number(watch("Currency")) || 1;
    const symbol = currency === 2 ? "$" : "₪";

    const formatCurrency = (amount: number, curr: number) =>
        (isNaN(amount) ? 0 : amount).toLocaleString("he-IL", {
            style: "currency",
            currency: curr === 2 ? "USD" : "ILS",
            maximumFractionDigits: 2,
        });

    const monthly = Number(watchMonthlyAmount) || 0;

    return (
        <div className="amount-info">
            <div className="amount-section">
                {/* צד ימין */}
                <div className="right-side-amount">
                    <div className="monthly-amount">
                        <p className="amount-text">תרומתך:</p>

                        <div className="monthly-amount-wrapper">
                            {/* input סכום */}
                            <input
                                type="text"
                                {...register(watchIs12Months ? "MonthlyAmount" : "Amount", {
                                    required: true,
                                    min: 1,
                                    setValueAs: (v) => parseFloat(String(v).replace(",", ".")) || 0,
                                })}
                                placeholder={
                                    watchIs12Months
                                        ? `סכום חודשי (${symbol})`
                                        : `סכום כל העסקה (${symbol})`
                                }
                                ref={monthlyAmountRef}
                                className="monthly-amount-input"
                                onChange={handleAmountChange}
                                value={watchIs12Months ? watchMonthlyAmount ?? "" : watchMonthlyAmount ?? ""}
                                maxLength={10}
                                inputMode="decimal"
                            />

                            {/* בחירת מטבע */}
                            <div className="currency-row" title="החלפת מטבע">
                                <label htmlFor="Currency" className="currency-caption">מטבע</label>
                                <select
                                    id="Currency"
                                    className="tashlumim-select"
                                    aria-label="בחר/י מטבע לתרומה"
                                    {...register("Currency", {
                                        required: true,
                                        setValueAs: (v) => parseInt(v, 10),
                                    })}
                                    value={currency}
                                    onChange={(e) => setValue("Currency", parseInt(e.target.value, 10))}
                                >
                                    <option value={1}>₪ ILS</option>
                                    <option value={2}>$ USD</option>
                                </select>
                              
                            </div>
                        </div>
                    </div>

                    {/* צ'קבוקס HK */}
                    <label className="checkbox-label">
                        <input type="checkbox" {...register("Is12Months")} className="checkbox-input" />
                        מאשר/ת חיוב חודשי של {formatCurrency(monthly, currency)} למשך 12 חודשים
                        {monthly ? ` (סה״כ ${formatCurrency(monthly * 12, currency)})` : ""}
                    </label>

                    {/* תשלומים מוצגים רק כשלא HK */}
                    {!watchIs12Months && (
                        <div className="tashlumim-section">
                            <label className="checkbox-label" htmlFor="Tashlumim">
                                מספר תשלומים:
                            </label>
                            <select
                                className="tashlumim-select"
                                id="Tashlumim"
                                {...register("Tashlumim", { required: true })}
                                defaultValue={1}
                            >
                                <option value={1}>
                                    תשלום אחד - {formatCurrency(monthly, currency)}
                                </option>
                                {[...Array(11).keys()].map((i) => {
                                    const n = i + 2;
                                    return (
                                        <option key={n} value={n}>
                                            {n} תשלומים - {formatCurrency((monthly / n) || 0, currency)} לחודש
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    )}
                </div>

                {/* צד שמאל */}
                <div className="left-side-amount">
                    <p className="amount-text">בית חב״ד יפו מקבל:</p>
                    <div className="for-year">
                        {watchIs12Months
                            ? formatCurrency(monthly * 12, currency)
                            : formatCurrency(monthly, currency)}
                    </div>
                </div>
            </div>

            {/* טופס */}
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
                {errors.Mail && <span className="error">נא להזין אימייל</span>}

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

                {/* שדה הקדשה – לא חובה */}
                <input
                    type="text"
                    {...register("Dedication", { maxLength: 300 })}
                    placeholder="הקדשה (לא חובה)"
                    className="form-input"
                />

                {/* שדות חבויים לשמירה הדוקה */}
                <input type="hidden" {...register("MonthlyAmount")} value={monthly} />
                {!watchIs12Months && (
                    <input type="hidden" {...register("Amount")} value={monthly} />
                )}

                <button type="submit" className="payment-button">המשך</button>
            </form>
        </div>
    );
};

export default PaymentFormStep1;
