import React, { useEffect } from "react";

const PaymentFormStep2 = ({ iframeRef, handleBack, paymentData }) => {
    useEffect(() => {
        // מאזין לקבלת תגובה מה-iframe
        const handleMessage = (event) => {
            if (event.origin !== "https://www.matara.pro") return;

            const { data } = event;
            if (data && data.TransactionResponse) {
                console.log("✅ תוצאת העסקה:", data.TransactionResponse);

                if (data.TransactionResponse.Status === "success") {
                    alert("🎉 התשלום בוצע בהצלחה!");
                } else {
                    alert("❌ התשלום נכשל. נסה שוב.");
                }
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    const handlePayment = () => {
        const iframe = iframeRef.current;

        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ TransactionId: paymentData.transactionId }, "https://www.matara.pro");
            console.log("🚀 מזהה העסקה נשלח ל-iframe:", paymentData.transactionId);
        } else {
            console.error("⚠️ לא ניתן לשלוח הודעה ל-iframe.");
        }
    };

    return (
        <div className="iframe-container">
            <h2 className="payment-title">💳 תשלום</h2>
            <iframe
                ref={iframeRef}
                title="NedarimPlus Payment"
                src="https://www.matara.pro/nedarimplus/iframe/"
                className="payment-iframe"
            ></iframe>

            <div className="button-container">
                <button className="back-button" onClick={handleBack}>⬅️ הקודם</button>
                <button className="next-button" onClick={handlePayment}>💵 בצע תשלום</button>
            </div>
        </div>
    );
};

export default PaymentFormStep2;
