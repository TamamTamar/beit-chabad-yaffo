import { useEffect, useRef, useState } from "react";

const PaymentFormStep2 = ({ paymentData, onPaymentResponse }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            console.log("📩 התקבלה הודעה מהאייפרם:", event);

            // בדיקה שההודעה מגיעה מהמקור הנכון
            if (event.origin !== "https://www.matara.pro") {
                console.warn("🚨 הודעה נדחתה - מקור לא מאושר:", event.origin);
                return;
            }

            if (event.source === iframeRef.current?.contentWindow) {
                console.log("✅ ההודעה התקבלה מה-iframe הנכון");
            } else {
                console.warn("⚠️ ההודעה לא הגיעה מה-iframe המצופה");
                return;
            }

            // עיבוד הנתונים שהתקבלו
            if (event.data?.status) {
                console.log("🎯 סטטוס תשלום שהתקבל:", event.data.status);
                onPaymentResponse(event.data);
                setPaymentStatus(event.data.status === "SUCCESS" ? "✅ תשלום בוצע בהצלחה" : "❌ שגיאה בתשלום");
            }

            if (event.data?.type === "paymentDataReceived") {
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
            iframe.contentWindow.postMessage(paymentData, "https://www.matara.pro"); // שינוי מ-* למקור מוגדר
        } else {
            console.error("🚨 האייפרם לא מוכן לקבל הודעות!");
            setPaymentStatus("❌ שגיאה בשליחת נתונים לאייפרם");
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
                    console.log("✅ האייפרם נטען בהצלחה");
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
