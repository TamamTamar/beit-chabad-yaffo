import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import NedarimDonation from '../kampein/paymentForm/NedarimDonation';
import ShabbatFormStep1 from './ShabbatFormStep1';
import ShabbatFormStep2 from './ShabbatFormStep2';
import { paymentService } from '../../services/payment-service';
import './ShabatForm.scss';

const ShabatForm = ({ }) => {
    const [step, setStep] = useState(1);
    const [paymentData, setPaymentData] = useState(null);
    const [selectedShabbat, setSelectedShabbat] = useState(null);

    const iframeRef = useRef(null);

    const handlePaymentCompletion = () => {
        paymentService.saveTransactionToServer(paymentData)
            .then(() => {
                console.log('Transaction saved successfully');
            })
            .catch((error) => {
                console.error('Error saving transaction:', error);
            })
            .finally(() => {
                setStep(4);
            });
    };

    const handleBack = () => {
        setStep(step === 3 ? 2 : 1);
    };

    return (
        <div className="shabat-form">
            <div className="steps">
                <span className={step === 1 ? "step active" : "step"}>1</span>
                <span className="sep"> - </span>
                <span className={step === 2 ? "step active" : "step"}>2</span>
                <span className="sep"> - </span>
                <span className={step === 3 ? "step active" : "step"}>3</span>
                <span className="sep"> - </span>
                <span className={step === 4 ? "step active" : "step"}>4</span>
            </div>

            {step === 1 && (
                <div className="step-content">
                    <ShabbatFormStep1
                        setStep={setStep}
                        setSelectedShabbat={setSelectedShabbat}
                    />
                </div>
            )}

            {step === 2 && (
                <div className="step-content">
                    <ShabbatFormStep2
                        setPaymentData={(data) => {
                            console.log("Payment Data from Step 2:", data);
                            setPaymentData(data);
                        }}
                        selectedShabbat={selectedShabbat}
                        setStep={setStep}
                    />
                </div>
            )}

            {step === 3 && (
                <div className="step-content">
                    <NedarimDonation
                        paymentData={paymentData}
                        handleBack={handleBack}
                        iframeRef={iframeRef}
                        onPaymentSuccess={handlePaymentCompletion}
                    />
                </div>
            )}

            {step === 4 && (
                <div className="confirmation">
                    <h2 className="thankyou-title">תודה רבה!</h2>
                    <p className="thankyou-text">התשלום בוצע בהצלחה והרישום הושלם.</p>
                    <button className="restart-button" onClick={() => setStep(1)}>חזור להתחלה</button>
                </div>
            )}
        </div>
    );
};

export default ShabatForm;
