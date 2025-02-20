import React, { useState, useRef, useEffect } from "react";

const PaymentFormStep2 = ({ paymentData, onPaymentResponse, handleBack, iframeRef }) => {
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
                setLoading(false);
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

    // שליחת נתוני התשלום ל-iframe
    const sendPaymentData = () => {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
            setLoading(true);
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
        <div className="iframe-container">
            <h2 className="payment-title">תשלום</h2>
            <iframe
                ref={iframeRef}
                title="NedarimPlus Payment"
                src="https://www.matara.pro/nedarimplus/iframe/"
                className="payment-iframe"
            ></iframe>
            <div className="button-container">
                <button className="back-button" onClick={handleBack}>הקודם</button>
                <button className="next-button" onClick={sendPaymentData} disabled={loading}>
                    {loading ? "שולח..." : "בצע תשלום"}
                </button>
            </div>
            {paymentStatus && <div className="payment-status">{paymentStatus}</div>}
            {paymentStatus === "✅ תשלום בוצע בהצלחה" && (
                <div className="success-message">
                    <h3>תודה רבה!</h3>
                    <p>התשלום בוצע בהצלחה. אישור התשלום נשלח לכתובת האימייל שלך.</p>
                </div>
            )}
        </div>
    );
};

export default PaymentFormStep2;