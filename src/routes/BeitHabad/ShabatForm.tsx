import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import NedarimDonation from '../kampein/NedarimDonation';
import ShabbatFormStep1 from './ShabbatFormStep1';
import ShabbatFormStep2 from './ShabbatFormStep2';
import { paymentService } from '../../services/payment-service';

const ShabatForm = ({ }) => {
    const [step, setStep] = useState(1);
    const [paymentData, setPaymentData] = useState(null);
    const [selectedShabbat, setSelectedShabbat] = useState(null); // סטייט לפרשה שנבחרה

    const iframeRef = useRef<HTMLIFrameElement>(null);

    const handlePaymentCompletion = () => {
        paymentService.saveTransactionToServer(paymentData)
            .then(() => {
                console.log('Transaction saved successfully');
            }
            )
            .catch((error) => {
                console.error('Error saving transaction:', error);
            }).finally(() => {

                setStep(4);
            }
            );

    };

    const handleBack = () => {
        setStep(step === 3 ? 2 : 1);
    };

    return (
        <div className="payment-form-container">
            <div className="step-indicator">
                <span className={step === 1 ? "active-step" : "inactive-step"}>1</span>
                <span> - </span>
                <span className={step === 2 ? "active-step" : "inactive-step"}>2</span>
                <span> - </span>
                <span className={step === 3 ? "active-step" : "inactive-step"}>3</span>
                <span> - </span>
                <span className={step === 4 ? "active-step" : "inactive-step"}>4</span>
            </div>

            {step === 1 && (
                <ShabbatFormStep1
                    setStep={setStep}
                    setSelectedShabbat={setSelectedShabbat} // מעביר את הפונקציה לעדכון הפרשה שנבחרה
                />
            )}

            {step === 2 && (
                <ShabbatFormStep2
                    setPaymentData={(data) => {
                        console.log("Payment Data from Step 2:", data); // בדיקת הנתונים שמגיעים משלב 2
                        setPaymentData(data); // שמירת הנתונים בסטייט של ShabatForm
                        console.log(data);
                    }}
                    selectedShabbat={selectedShabbat}
                    setStep={setStep}
                />
            )}

            {step === 3 && (
                <NedarimDonation
                    paymentData={paymentData}
                    handleBack={handleBack}
                    iframeRef={iframeRef}
                    onPaymentSuccess={handlePaymentCompletion}
                />
            )}

            {step === 4 && (
                <div className="confirmation-step">
                    <h2>תודה רבה!</h2>
                    <p>התשלום בוצע בהצלחה והרישום הושלם.</p>
                    <button onClick={() => setStep(1)}>חזור להתחלה</button>
                </div>
            )}
        </div>
    );
};

export default ShabatForm;