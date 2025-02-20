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

            // בדיקה שההודעה מכילה נתוני תשלום תקינים
            if (!event.data || typeof event.data !== "object") {
                console.warn("⚠️ התקבלה הודעה לא תקינה:", event.data);
                return;
            }

            // אם ההודעה קשורה לתשלום, נעדכן את הסטטוס
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

    // בדיקה אם ה-iframe מוכן לתקשורת
    useEffect(() => {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
            console.log("📤 בודק תקשורת עם האייפרם...");
            iframe.contentWindow.postMessage({ type: "ping" }, "https://www.matara.pro");
        }
    }, [iframeLoaded]);

    // שליחת נתוני התשלום ל-iframe
    const sendPaymentData = () => {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
            const message = {
                type: "paymentRequest",
                payload: paymentData
            };
            console.log("📤 שולח נתוני תשלום לאייפרם:", message);
            iframe.contentWindow.postMessage(message, "https://www.matara.pro");
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
                onLoad={() => setIframeLoaded(true)}
            />

            <button
                onClick={sendPaymentData}
                className="next-button"
            >
                שלח תשלום
            </button>

            {paymentStatus && <div className="payment-status">{paymentStatus}</div>}
        </div>
    );
};

export default PaymentFormStep2;