import React, { useEffect, useRef, useState } from "react";

const PaymentFormStep2 = ({ handleBack, handlePayment, iframeRef }) => {
  const [status, setStatus] = useState(null);
  const [transactionResponse, setTransactionResponse] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      // אימות מקור ההודעה לביטחון
      if (event.origin !== "https://www.matara.pro") return;

    
      const { Name, Value } = event.data;

      switch (Name) {
        case "Height":
          if (iframeRef.current) {
            iframeRef.current.style.height = `${parseInt(Value) + 15}px`;
          }
          break;

        case "TransactionResponse":
          setTransactionResponse(Value);
          setStatus(Value.Status === "Error" ? "error" : "success");
          break;

        default:
          console.warn("⚠️ הודעה לא מזוהה:", Name);
      }
    };

    window.addEventListener("message", handleMessage);

    // שליחת בקשת גובה בעת טעינת ה-iframe
    const iframe = iframeRef.current;
    const requestHeight = () => {
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ Name: "GetHeight" }, "https://www.matara.pro");
      }
    };

    iframe?.addEventListener("load", requestHeight);

    return () => {
      window.removeEventListener("message", handleMessage);
      iframe?.removeEventListener("load", requestHeight);
    };
  }, []);



  return (
    <div className="iframe-container">
      <h2 className="payment-title">💳 תשלום</h2>

      <iframe
        ref={iframeRef}
        title="NedarimPlus Payment"
        src="https://www.matara.pro/nedarimplus/iframe/"
        className="payment-iframe"
        style={{ width: "100%", border: "none" }}
      ></iframe>

      <div className="button-container">
        <button className="back-button" onClick={handleBack}>⬅️ הקודם</button>
        <button className="next-button" onClick={handlePayment}>💵 בצע תשלום</button>
      </div>

      {status === "success" && (
        <div className="success-message">
          ✅ התשלום עבר בהצלחה! פרטי עסקה: {JSON.stringify(transactionResponse)}
        </div>
      )}

      {status === "error" && (
        <div className="error-message">
          ❌ אירעה שגיאה בביצוע התשלום. אנא נסה שנית.
        </div>
      )}
    </div>
  );
};

export default PaymentFormStep2;
