import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import PaymentFormStep1 from "./PaymentFormStep1";
import PaymentFormStep2 from "./PaymentFormStep2";
import "./PaymentForm.scss";

const PaymentForm = ({ monthlyAmount }) => {
    const [step, setStep] = useState(1);
    const [paymentData, setPaymentData] = useState(null);
    const iframeRef = useRef(null);
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
            MonthlyAmount: initialAmount,
            Is12Months: initialAmount !== 0,
        }
    });

    const watchIs12Months = watch("Is12Months");
    const watchMonthlyAmount = watch("MonthlyAmount");

    useEffect(() => {
        const monthlyAmountValue = parseFloat(watchMonthlyAmount) || 0;
        setValue("MonthlyAmount", monthlyAmountValue);
        setValue("PaymentType", watchIs12Months ? "HK" : "Ragil");
    }, [watchIs12Months, watchMonthlyAmount, setValue]);

    const onSubmit = (data) => {
        const annualAmount = data.Is12Months ? data.MonthlyAmount * 12 : data.MonthlyAmount;

        const paymentData = {
            Mosad: "7013920",
            ApiValid: "zidFYCLaNi",
            Zeout: data.Zeout || "",
            FirstName: data.FirstName,
            LastName: data.LastName,
            Street: data.Street || "",
            City: data.City || "",
            Phone: data.Phone,
            Mail: data.Mail,
            PaymentType: data.Is12Months ? "HK" : "Ragil",
            Amount: annualAmount,
            Tashlumim: data.Is12Months ? 12 : data.Tashlumim,
            Currency: 1,
            Groupe: data.Groupe || "",
            Comment: data.Comment || "",
            CallBack: "https://node-beit-chabad-yaffo.onrender.com/api/payment/nedarim",
            CallBackMailError: "lchabadyaffo@gmail.com",
        };

        setPaymentData(paymentData);
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const handlePayment = async (response) => {
        console.log("Response from iframe:", response);

        if (response.status === "success") {
            try {
                const serverResponse = await fetch("https://node-beit-chabad-yaffo.onrender.com/api/payment/nedarim", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(paymentData),
                });

                if (!serverResponse.ok) {
                    throw new Error("Network response was not ok");
                }

                const responseData = await serverResponse.json();
                console.log("Response from server:", responseData);
            } catch (error) {
                console.error("Error sending payment data to server:", error);
            }
        } else {
            console.log("error paymentData", response);
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
                <PaymentFormStep1
                    register={register}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    errors={errors}
                    watchMonthlyAmount={watchMonthlyAmount}
                    watchIs12Months={watchIs12Months}
                    setValue={setValue}
                />
            )}
            {step === 2 && (
                <PaymentFormStep2
                    paymentData={paymentData}
                    onPaymentResponse={handlePayment}
                    handleBack={handleBack}
                    iframeRef={iframeRef}
                />
            )}
        </div>
    );
};

export default PaymentForm;