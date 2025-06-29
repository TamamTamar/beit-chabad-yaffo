import { useRef, useState } from 'react';
import { newRishum } from '../../services/shabbatService';
import NedarimDonation from '../kampein/paymentForm/NedarimDonation';
import './ShabatForm.scss';
import ShabbatFormStep1 from './ShabbatFormStep1';
import ShabbatFormStep2 from './ShabbatFormStep2';
import ShabbatFormStep3 from './ShabbatFormStep3';

const ShabatForm = ({ }) => {
    const [step, setStep] = useState(1);
    const [paymentData, setPaymentData] = useState(null);
    const [selectedShabbat, setSelectedShabbat] = useState(null);
    const [personalData, setPersonalData] = useState(null);

    const iframeRef = useRef(null);

    
    const handlePaymentCompletion = async () => {
      try {
        // שליחה לשרת שלך (רישום שבת)
        await newRishum(paymentData.extraData);
    

        setStep(4); // מעבר לשלב הבא
      } catch (err) {
        // טיפול בשגיאה
        console.error('שגיאה בשליחה:', err);
        // אפשר להציג הודעת שגיאה למשתמש
      }
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
                        selectedShabbat={selectedShabbat}
                        setStep={setStep}
                        setPersonalData={setPersonalData}
                    />
                </div>
            )}
            
            {step === 3 && (
                <div className="step-content">
                    <ShabbatFormStep3
                        selectedShabbat={selectedShabbat}
                        setStep={setStep}
                        personalData={personalData}
                        setPaymentData={setPaymentData}
                    />
                </div>
            )}


            {step === 4 && (
                <div className="step-content">
                    <NedarimDonation
                        paymentData={paymentData.apiData}
                        handleBack={handleBack}
                        iframeRef={iframeRef}
                        onPaymentSuccess={handlePaymentCompletion}
                    />
                </div>
            )}

            {step === 5 && (
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
