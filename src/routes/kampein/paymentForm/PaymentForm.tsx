import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import NedarimDonation from "./NedarimDonation";
import PaymentFormStep1 from "./PaymentFormStep1";
import Confirmation from "../Confirmation";
import "./PaymentForm.scss";
import { PaymentData, PaymentFormProps } from "../../../@Types/chabadType";




const PaymentForm = ({ monthlyAmount }: PaymentFormProps) => {
  const [step, setStep] = useState(1);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const location = useLocation();
  const ref = new URLSearchParams(location.search).get("ref");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
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
    },
  });

  const watchIs12Months = watch("Is12Months");
  const watchMonthlyAmount = watch("MonthlyAmount");

  useEffect(() => {
    const monthlyValue = (watchMonthlyAmount) || 0;
    setValue("MonthlyAmount", monthlyValue);
    setValue("PaymentType", watchIs12Months ? "HK" : "Ragil");
  }, [watchIs12Months, watchMonthlyAmount, setValue]);

  const onSubmit = (data: any) => {
    const annualAmount = data.Is12Months ? data.MonthlyAmount * 12 : data.MonthlyAmount;

    const newPaymentData: PaymentData = {
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
      Comment: `תרומה מאת ${data.FirstName} ${data.LastName}, טלפון: ${data.Phone}${ref ? `, ref: ${ref}` : ""}`,
      CallBack: "https://node-beit-chabad-yaffo.onrender.com/api/payment/payment-callback",
      CallBackMailError: "lchabadyaffo@gmail.com",
    };

    setPaymentData(newPaymentData);
    setStep(2);
  };

  const handleBack = () => setStep(1);

  return (
    <div className="payment-form-container">
      <div className="step-indicator">
        <span className={step === 1 ? "active-step" : "inactive-step"}>1</span>
        <span> - </span>
        <span className={step === 2 ? "active-step" : "inactive-step"}>2</span>
        <span> - </span>
        <span className={step === 3 ? "active-step" : "inactive-step"}>3</span>
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

      {step === 2 && paymentData && (
        <NedarimDonation
          paymentData={paymentData}
          handleBack={handleBack}
          iframeRef={iframeRef}
          onPaymentSuccess={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <Confirmation
          title="תודה רבה על תרומתך לבית חב״ד יפו!"
          message="הנדיבות שלך מחזקת את פעילותנו למען הקהילה ומאפשרת לנו להמשיך להפיץ אור וטוב ביפו. תבורך/י!"
        />
      )}
    </div>
  );
};

export default PaymentForm;
