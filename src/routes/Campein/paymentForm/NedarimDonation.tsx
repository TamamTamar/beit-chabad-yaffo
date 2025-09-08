import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NedarimDonation = ({ paymentData, handleBack, iframeRef, onPaymentSuccess }) => {
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // קריאת הודעות מה-iframe
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
          clearTimeout(timeoutId);
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
            setTimeout(() => {
              onPaymentSuccess();
            }, 2000);
          }
          break;
      }
    }

    // שליחת הודעות ל-iframe
    function PostNedarim(Data: object) {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(Data, '*');
      } else {
        console.error('iframeRef.current או contentWindow אינם מוגדרים');}
    }

    // לחיצה על כפתור תשלום
    (window as any).PayBtClick = function () {

      // בדיקת תקינות נתונים
      if (
        !paymentData ||
        !paymentData.Amount ||
        !paymentData.Mail ||
        !paymentData.FirstName ||
        !paymentData.LastName
      ) {
        alert('אנא מלא את כל הפרטים החיוניים לפני תשלום');
        return;
      }

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

      // טיימאאוט אם אין תגובה מהשרת
      timeoutId = setTimeout(() => {
        if (waitPay) waitPay.style.display = 'none';
        if (payBtDiv) payBtDiv.style.display = 'block';
        if (errorDiv) errorDiv.innerHTML = 'לא התקבלה תשובה מהשרת. נסה שוב או פנה לתמיכה.';
      }, 20000); // 20 שניות
    };

    window.addEventListener('message', ReadPostMessage);

    // טעינת ה-iframe ושליחת בקשת גובה
    iframeRef.current?.addEventListener('load', () => {
      PostNedarim({ Name: 'GetHeight' });
    });

    return () => {
      window.removeEventListener('message', ReadPostMessage);
      delete (window as any).PayBtClick;
      clearTimeout(timeoutId);
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