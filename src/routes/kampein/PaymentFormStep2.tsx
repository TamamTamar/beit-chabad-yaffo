import { useEffect, useRef, useState } from "react";

const PaymentFormStep2 = ({ paymentData, onPaymentResponse }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            console.log("📩 התקבלה הודעה מהאייפרם:", event);

            // סינון מקורות לא רצויים
            if (event.origin !== "https://www.matara.pro") {
                console.warn("🚨 הודעה נדחתה - מקור לא מאושר:", event.origin);
                return;
            }

            // בדיקה שההודעה באמת מכילה נתוני תשלום
            if (!event.data || typeof event.data !== "object") {
                console.warn("⚠️ התקבלה הודעה לא תקינה:", event.data);
                return;
            }

            // וידוא שההודעה קשורה לתשלום
            if (!event.data.status && !event.data.type) {
                console.warn("⚠️ הודעה לא קשורה לתשלום - מתעלם");
                return;
            }

            console.log("✅ ההודעה התקבלה מה-iframe:", event.data);

            // עיבוד תוצאה
            if (event.data.status) {
                setPaymentStatus(event.data.status === "SUCCESS" ? "✅ תשלום בוצע בהצלחה" : "❌ שגיאה בתשלום");
                onPaymentResponse(event.data);
            }

            if (event.data.type === "paymentDataReceived") {
                console.log("📤 האייפרם קיבל את נתוני התשלום בהצלחה:", event.data);
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
            console.log("📤 שולח נתוני תשלום לאייפרם:", paymentData);
            iframe.contentWindow.postMessage(paymentData, "https://www.matara.pro");
        } else {
            console.error("🚨 האייפרם לא מוכן לקבל הודעות!");
            setPaymentStatus("❌ שגיאה בשליחת נתונים לאייפרם");
        }
    };


    return (
        <div className="payment-container">
            <iframe
                ref={iframeRef}
                src="https://www.matara.pro/nedarimplus/iframe/"
                width="100%"
                height="600px"
                style={{ border: "none" }}
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
