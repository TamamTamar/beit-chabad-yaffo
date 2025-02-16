import { useEffect, useRef, useState } from "react";

const PaymentFormStep2 = ({ paymentData, onPaymentResponse }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            console.log("מקור ההודעה:", event.origin);  // מידע על מקור ההודעה
            console.log("תוכן ההודעה:", event.data);  // תוכן ההודעה עצמה
        
            if (event.origin !== "https://www.matara.pro") {
                console.warn("הודעה נדחתה - מקור לא מאושר:", event.origin);
                return;
            }
        
            if (event.data && event.data.status) {
                onPaymentResponse(event.data);
                setPaymentStatus(event.data.status === "SUCCESS" ? "תשלום בוצע בהצלחה" : "שגיאה בתשלום");
            }

            if (event.data && event.data.type === "paymentDataReceived") {
                console.log("האייפרם קיבל את נתוני התשלום בהצלחה:", event.data);
            }
        };

        window.addEventListener("message", handleMessage);
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [onPaymentResponse]);

    const sendPaymentData = () => {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
            console.log("שולח נתוני תשלום לאייפרם:", paymentData);
            iframe.contentWindow.postMessage(paymentData, "*");
        } else {
            console.error("האייפרם לא מוכן לקבל הודעות");
        }
    };

    return (
        <div className="payment-container">
            <iframe
                ref={iframeRef}
                title="NedarimPlus Payment"
                src="https://www.matara.pro/nedarimplus/iframe/"
                className="payment-iframe"
                onLoad={() => {
                    console.log("האייפרם נטען בהצלחה");
                    setIframeLoaded(true);
                }}
            />
            
            <button
                onClick={sendPaymentData}
                disabled={!iframeLoaded}
                className="payment-button"
            >
                שלח תשלום
            </button>

            {paymentStatus && <div className="payment-status">{paymentStatus}</div>}
        </div>
    );
};

export default PaymentFormStep2;