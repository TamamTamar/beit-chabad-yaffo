// src/routes/NedarimDonation.tsx
import React, { FC, useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { createFullKaparotPayload } from "./kaparotFullPayload";
import "./CaparotPayment.scss"; // 👈 הוסף/י את זה



const CaparotPayment: FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();

  const { amount: amountParam } = useParams<{ amount: string }>(); // ← קורא מהנתיב
  const amount = Number(amountParam) || 0;                          // ← מספר

  const paymentData = createFullKaparotPayload({
    Mosad: "7013920",
    ApiValid: "zidFYCLaNi",
    Amount: amount,
    Tashlumim: 1,
  });

  const handleBack = () => navigate(-1);
  const onPaymentSuccess = () => {
    alert("התשלום נקלט בהצלחה!");
    navigate("/"); // אפשר לשנות יעד אחרי תשלום
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    function ReadPostMessage(event: MessageEvent) {
      const iframe = iframeRef.current;
      const waitFrame = document.getElementById("WaitNedarimFrame");
      const resultDiv = document.getElementById("Result");
      const errorDiv = document.getElementById("ErrorDiv");
      const payBtDiv = document.getElementById("PayBtDiv");
      const okDiv = document.getElementById("OkDiv");
      const waitPay = document.getElementById("WaitPay");

      switch (event.data.Name) {
        case "Height":
          if (iframe) {
            iframe.style.height = `${parseInt(event.data.Value, 10) + 15}px`;
            if (waitFrame) waitFrame.style.display = "none";
          }
          break;

        case "TransactionResponse":
          clearTimeout(timeoutId);
          if (resultDiv) resultDiv.innerHTML = `סטטוס: ${event.data.Value.Status}`;

          if (event.data.Value.Status === "Error") {
            if (errorDiv) errorDiv.innerHTML = `שגיאה: ${event.data.Value.Message}`;
            if (waitPay) waitPay.style.display = "none";
            if (payBtDiv) payBtDiv.style.display = "block";
          } else {
            if (waitPay) waitPay.style.display = "none";
            if (okDiv) okDiv.style.display = "block";
            setTimeout(() => onPaymentSuccess(), 2000);
          }
          break;
      }
    }

    function PostNedarim(Data: object) {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(Data, "*");
      }
    }

    (window as any).PayBtClick = function () {
      if (!paymentData.Amount) {
        alert("לא הוזן סכום תקין");
        return;
      }

      const waitPay = document.getElementById("WaitPay");
      const payBtDiv = document.getElementById("PayBtDiv");
      const okDiv = document.getElementById("OkDiv");
      const errorDiv = document.getElementById("ErrorDiv");

      if (waitPay) waitPay.style.display = 'block';
      if (payBtDiv) payBtDiv.style.display = 'none';
      if (okDiv) okDiv.style.display = 'none';
      if (errorDiv) errorDiv.innerHTML = '';


      PostNedarim({ Name: "FinishTransaction2", Value: paymentData });

      timeoutId = setTimeout(() => {
        if (waitPay) waitPay.style.display = "none";
        if (payBtDiv) payBtDiv.style.display = "block";
        if (errorDiv)
          errorDiv.innerHTML = "לא התקבלה תשובה מהשרת. נסי שוב או פני לתמיכה.";
      }, 20000);
    };

    window.addEventListener("message", ReadPostMessage);
    iframeRef.current?.addEventListener("load", () => {
      PostNedarim({ Name: "GetHeight" });
    });

    return () => {
      window.removeEventListener("message", ReadPostMessage);
      delete (window as any).PayBtClick;
      clearTimeout(timeoutId);
    };
  }, [paymentData, navigate]);

  return (
    <div className="iframe-container" dir="rtl">
      <div className="amount-banner">
        סכום לתשלום: {amount} ₪
      </div>

      <div id="WaitNedarimFrame">טוען...</div>

      <iframe
        ref={iframeRef}
        id="NedarimFrame"
        title="Nedarim Plus"
        src="https://matara.pro/nedarimplus/iframe?language=he"
        className="payment-iframe"
        scrolling="no"
      />
      <div id="Result" className="result"></div>
      <div id="ErrorDiv" className="error-div"></div>
      <div id="OkDiv" className="ok-div">✔️ התשלום הצליח!</div>
      <div id="WaitPay" className="wait-pay">⏳ מעבד תשלום...</div>
      <div id="PayBtDiv" className="pay-bt-div">
        <button className="pay-back-button" onClick={handleBack}>
          הקודם
        </button>
        <button
          className="pay-back-button"
          onClick={() => (window as any).PayBtClick()}
        >
          בצע תשלום
        </button>
      </div>
    </div>
  );
};

export default CaparotPayment;
