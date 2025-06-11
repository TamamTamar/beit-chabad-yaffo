import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../../services/payment-service';

const NedarimDonation = ({ paymentData, handleBack, iframeRef, onPaymentSuccess }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // 📩 קריאת הודעות מה-iframe
    function ReadPostMessage(event: MessageEvent) {
      const iframe = iframeRef.current;
      const waitFrame = document.getElementById('WaitNedarimFrame');
      const resultDiv = document.getElementById('Result');
      const errorDiv = document.getElementById('ErrorDiv');
      const payBtDiv = document.getElementById('PayBtDiv');
      const okDiv = document.getElementById('OkDiv');
      const waitPay = document.getElementById('WaitPay');

      switch (event.data.Name) {
        case 'Height':
          if (iframe) {
            iframe.style.height = `${parseInt(event.data.Value, 10) + 15}px`;
            if (waitFrame) waitFrame.style.display = 'none';
          }
          break;

        case 'TransactionResponse':
          if (resultDiv) {
            resultDiv.innerHTML = `סטטוס: ${event.data.Value.Status}`;
          }

          if (event.data.Value.Status === 'Error') {
            if (errorDiv) errorDiv.innerHTML = `שגיאה: ${event.data.Value.Message}`;
            if (waitPay) waitPay.style.display = 'none';
            if (payBtDiv) payBtDiv.style.display = 'block';
          } else {
            if (waitPay) waitPay.style.display = 'none';
            if (okDiv) okDiv.style.display = 'block';

            // קריאה ל-onPaymentSuccess במקרה של הצלחה
            if (onPaymentSuccess) {
              onPaymentSuccess();
            }

            // ניווט לדף אחר לאחר הצלחת התשלום
            setTimeout(() => {
              navigate('/confirmation'); // נווט לדף האישור
            }, 2000); // המתנה של 2 שניות לפני הניווט
          }
          break;
      }
    }

    // 🚀 שליחת הודעות ל-iframe
    function PostNedarim(Data: object) {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(Data, '*');
      } else {
        console.error("⚠️ לא ניתן לשלוח הודעה ל-iframe.");
      }
    }

    // 🖱️ לחיצה על כפתור תשלום
    (window as any).PayBtClick = function () {
      const waitPay = document.getElementById('WaitPay');
      const payBtDiv = document.getElementById('PayBtDiv');
      const okDiv = document.getElementById('OkDiv');
      const errorDiv = document.getElementById('ErrorDiv');

      if (waitPay) waitPay.style.display = 'block';
      if (payBtDiv) payBtDiv.style.display = 'none';
      if (okDiv) okDiv.style.display = 'none';
      if (errorDiv) errorDiv.innerHTML = '';

      PostNedarim({
        Name: 'FinishTransaction2',
        Value: paymentData,
      });
    };

    // 🖥️ חיבור מאזין להודעות
    window.addEventListener('message', ReadPostMessage);

    // 📥 טעינת ה-iframe ושליחת בקשת גובה
    iframeRef.current?.addEventListener('load', () => {
      PostNedarim({ Name: 'GetHeight' });
    });

    // 🧹 ניקוי מאזינים כשעוזבים את הדף
    return () => {
      window.removeEventListener('message', ReadPostMessage);
      delete (window as any).PayBtClick;
    };
  }, [paymentData, iframeRef, navigate, onPaymentSuccess]);

  return (
    <div className="iframe-container">
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
        <button className="pay-back-button" onClick={handleBack}>הקודם</button>
        <button className="pay-back-button" onClick={() => (window as any).PayBtClick()}>בצע תשלום</button>
      </div>
    </div>
  );
};

export default NedarimDonation;