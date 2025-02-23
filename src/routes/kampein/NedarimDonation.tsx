import { useEffect, useRef } from 'react';

export default function NedarimDonation({ paymentData, handleBack, iframeRef }) {
  useEffect(() => {
    // 🛡️ טיפול בשגיאות גלובליות
    window.onerror = function (msg, _url, _line, _col, _error) {
      alert(`שגיאת תוכנה. פנה לתמיכה טכנית. שגיאה: ${msg}`);
    };

    // 📩 קריאת הודעות מה-iframe
    function ReadPostMessage(event: MessageEvent) {
      console.log(event.data);
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
            resultDiv.innerHTML = `<b>TransactionResponse:<br/>${JSON.stringify(event.data.Value)}</b><br/>see full data in console`;
          }
          console.log(event.data.Value);

          if (event.data.Value.Status === 'Error') {
            if (errorDiv) errorDiv.innerHTML = event.data.Value.Message;
            if (waitPay) waitPay.style.display = 'none';
            if (payBtDiv) payBtDiv.style.display = 'block';
          } else {
            if (waitPay) waitPay.style.display = 'none';
            if (okDiv) okDiv.style.display = 'block';
          }
          break;
      }
    }

    // 🚀 שליחת הודעות ל-iframe
    function PostNedarim(Data: object) {
      iframeRef.current?.contentWindow?.postMessage(Data, '*');
    }

    // 🖱️ לחיצה על כפתור תשלום
    (window as any).PayBtClick = function () {
      PostNedarim({
        Name: 'FinishTransaction2',
        Value: paymentData,
      });
    };

    // 🖥️ חיבור מאזין להודעות
    window.addEventListener('message', ReadPostMessage);

    // 📥 טעינת ה-iframe ושליחת בקשת גובה
    iframeRef.current?.addEventListener('load', () => {
      console.log('StartNedarim');
      PostNedarim({ Name: 'GetHeight' });
    });

    // 🧹 ניקוי מאזינים כשעוזבים את הדף
    return () => {
      window.removeEventListener('message', ReadPostMessage);
      delete (window as any).PayBtClick;
    };
  }, [paymentData, iframeRef]);

  return (
    <div>
      <div id="WaitNedarimFrame">טוען...</div>
      <iframe
        ref={iframeRef}
        id="NedarimFrame"
        title="Nedarim Plus"
        src="https://matara.pro/nedarimplus/iframe?language=en"
        style={{ width: '100%', border: 'none', minHeight: '600px' }}
        scrolling="no"
      />
      <div id="Result"></div>
      <div id="ErrorDiv" style={{ color: 'red' }}></div>
      <div id="PayBtDiv">
        <button onClick={() => (window as any).PayBtClick()}>בצע תשלום</button>
      </div>
      <div id="OkDiv" style={{ display: 'none', color: 'green' }}>✔️ תשלום הצליח!</div>
      <div id="WaitPay" style={{ display: 'none' }}>⏳ מעבד תשלום...</div>
      <button className="back-button" onClick={handleBack}>הקודם</button>
    </div>
  );
}