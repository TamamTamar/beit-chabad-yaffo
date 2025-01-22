import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface PaymentFormProps {
    institutionId: string;
    apiValid: string;
    zeout: string;
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    phone: string;
    email: string;
    paymentType: string;
    amount: number;  // הוספת סכום כאן
    tashlumim: number;
    currency: number;
    groupe: string;
    comment: string;
    param1: string;
    param2: string;
    callBack: string;
    callBackMailError: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
    institutionId,
    apiValid,
    zeout,
    firstName,
    lastName,
    street,
    city,
    phone,
    email,
    paymentType,
    amount,
    tashlumim,
    currency,
    groupe,
    comment,
    param1,
    param2,
    callBack,
    callBackMailError
}) => {
    const [showIframe, setShowIframe] = useState(false);
    const [customAmount, setCustomAmount] = useState<number>(amount); // הגדרת סכום התחלתי עם הערך של amount

    // הגדרת useForm
    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        // אם הסכום משתנה דרך prop amount, נעדכן את הסטייט
        setCustomAmount(amount);
    }, [amount]);

    const onSubmit = (data: any) => {
        setShowIframe(true);
    };

    // יצירת ה-URL עם פרמטרים ב-URL
    const iframeUrl = (formData: any) => {
        return `https://www.matara.pro/nedarimplus/iframe/sample2.html?Mosad=${institutionId}&ApiValid=${apiValid}&FirstName=${formData.firstName}&LastName=${formData.lastName}&Street=${formData.street}&City=${formData.city}&Phone=${formData.phone}&Mail=${formData.email}&Amount=${customAmount}&PaymentType=${formData.paymentType}&Currency=1&CallBack=${callBack}&CallBackMailError=${callBackMailError}`;
    };

    return (
        <div className="payment-form">
            {!showIframe ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label>שם פרטי:</label>
                        <input 
                            type="text" 
                            {...register("firstName", { required: "שדה זה חובה" })} 
                        />
                        {errors.firstName && <p>{String(errors.firstName.message)}</p>}
                    </div>
                    <div>
                        <label>שם משפחה:</label>
                        <input 
                            type="text" 
                            {...register("lastName", { required: "שדה זה חובה" })} 
                        />
                        {errors.lastName && <p>{String(errors.lastName.message)}</p>}
                    </div>
                    <div>
                        <label>רחוב:</label>
                        <input 
                            type="text" 
                            {...register("street", { required: "שדה זה חובה" })} 
                        />
                        {errors.street && <p>{String(errors.street.message)}</p>}   
                    </div>
                    <div>
                        <label>עיר:</label>
                        <input 
                            type="text" 
                            {...register("city", { required: "שדה זה חובה" })} 
                        />
                        {errors.city && <p>{String(errors.city.message)}</p>}   
                    </div>
                    <div>
                        <label>טלפון:</label>
                        <input 
                            type="text" 
                            {...register("phone", { required: "שדה זה חובה" })} 
                        />
                        {errors.phone && <p>{String(errors.phone.message)}</p>}   
                    </div>
                    <div>
                        <label>אימייל:</label>
                        <input 
                            type="email" 
                            {...register("email", { required: "שדה זה חובה" })} 
                        />
                        {errors.email && <p>{String(errors.email.message)}</p>} 
                    </div>
                    <div>
                        <label>סכום התרומה:</label>
                        <input 
                            type="number" 
                            value={customAmount}  // מציג את הסכום המעודכן (התחלתי או שהמשתמש שינה אותו)
                            onChange={(e) => setCustomAmount(Number(e.target.value))}  // עדכון סכום חופשי
                        />
                    </div>
                    <div>
                        <label>סוג תשלום:</label>
                        <select {...register("paymentType", { required: "שדה זה חובה" })}>
                            <option value="Ragil">עסקה רגילה</option>
                            <option value="HK">הוראת קבע</option>
                            <option value="CreateToken">יצירת טוקן</option>
                        </select>
                        {errors.paymentType && <p>{String(errors.paymentType.message)}</p>}
                    </div>
                    <button type="submit">שלח</button>
                </form>
            ) : (
                <iframe
                    src={iframeUrl({ firstName, lastName, street, city, phone, email, paymentType })}
                    width="100%"
                    height="600"
                    title="Payment Form"
                    frameBorder="0"
                ></iframe>
            )}
        </div>
    );
};

export default PaymentForm;
