import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import "./PaymentForm.scss";
import NedarimDonation from "../kampein/NedarimDonation";
import PaymentFormStep1 from "../kampein/PaymentFormStep1";


const ShabatPayment = ({ monthlyAmount }) => {
    const [step, setStep] = useState(1);
    const [paymentData, setPaymentData] = useState(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            Zeout: "",
            FirstName: "",
            LastName: "",
            Street: "",
            City: "",
            Phone: "",
            Mail: "",
            Amount: monthlyAmount || 0,
            Tashlumim: 1,
            Currency: 1,
            Groupe: "",
            Comment: "",
            Dedication: "",
            PaymentType: "Ragil",
            MonthlyAmount: monthlyAmount || 0,
            Is12Months: (monthlyAmount || 0) !== 0,
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

        const newPaymentData = {
            Mosad: "7013920",
            ApiValid: "zidFYCLaNi",
            Zeout: data.Zeout,
            FirstName: data.FirstName,
            LastName: data.LastName,
            Street: data.Street,
            City: data.City,
            Phone: data.Phone,
            Mail: data.Mail,
            PaymentType: data.Is12Months ? "HK" : "Ragil",
            Amount: annualAmount,
            Tashlumim: data.Is12Months ? 12 : data.Tashlumim,
            Currency: 1,
            Groupe: data.Groupe,
            Comment: data.Comment,
            CallBack: "https://node-beit-chabad-yaffo.onrender.com/api/payment/nedarim",
            CallBackMailError: "lchabadyaffo@gmail.com",
        };

        setPaymentData(newPaymentData);
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };
    return (
        <div className="payment-form-container">
            <div className="step-indicator">
                <span className={step === 1 ? "active-step" : "inactive-step"}>1</span>
                <span> - </span>
                <span className={step === 2 ? "active-step" : "inactive-step"}>2</span>
            </div>

        </div>
    );
};

export default ShabatPayment;