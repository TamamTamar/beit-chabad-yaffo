import { useEffect } from "react";
import { useForm } from "react-hook-form";

const ADULT_PRICE = 50;
const CHILD_PRICE = 25;
const COUPLE_PRICE = 90;

const ShabbatFormStep2 = ({ selectedShabbat,setStep }) => {
    const { register, watch, handleSubmit } = useForm({
        defaultValues: {
            adults: 0,
            children: 0,
            couples: 0,
        }
    });

    const adults = watch("adults");
    const children = watch("children");
    const couples = watch("couples");

    const total =
        adults * ADULT_PRICE +
        children * CHILD_PRICE +
        couples * COUPLE_PRICE;

    const onSubmit = (data) => {
        const newPaymentData = {
            ...data,
            selectedShabbat,
            total,
        };

        console.log("Payment Data:", newPaymentData);
        // Here you can handle the payment process with the newPaymentData
        setStep(3); // Move to the next step after submission
    };

    return (
        <div className="shabbat-form">
            <h2>רישום לשבת - {selectedShabbat?.parasha} ({selectedShabbat?.date})</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="select-row">
                    <label>מס' מבוגרים ({ADULT_PRICE} ₪ לאדם)</label>
                    <select {...register("adults")}>
                        {[...Array(11)].map((_, i) => (
                            <option key={i} value={i}>{i}</option>
                        ))}
                    </select>
                </div>

                <div className="select-row">
                    <label>מס' ילדים ({CHILD_PRICE} ₪ לילד)</label>
                    <select {...register("children")}>
                        {[...Array(11)].map((_, i) => (
                            <option key={i} value={i}>{i}</option>
                        ))}
                    </select>
                </div>

                <div className="select-row">
                    <label>מס' זוגות ({COUPLE_PRICE} ₪ לזוג)</label>
                    <select {...register("couples")}>
                        {[...Array(6)].map((_, i) => (
                            <option key={i} value={i}>{i}</option>
                        ))}
                    </select>
                </div>

                <div className="total-display">
                    <strong>סה"כ לתשלום: {total.toLocaleString()} ₪</strong>
                </div>

                <button type="submit">המשך</button>
            </form>
        </div>
    );
};

export default ShabbatFormStep2;
