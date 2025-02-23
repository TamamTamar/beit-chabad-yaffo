import { useEffect, useRef } from 'react';

export default function NedarimDonation() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
      const mosad = (document.getElementById('MosadId') as HTMLInputElement)?.value;
      const apiValid = (document.getElementById('ApiValid') as HTMLInputElement)?.value;
      const paymentType = (document.getElementById('PaymentType') as HTMLInputElement)?.value;
      const amount = (document.getElementById('Amount') as HTMLInputElement)?.value;
      const clientName = (document.getElementById('ClientName') as HTMLInputElement)?.value;
      const street = (document.getElementById('Street') as HTMLInputElement)?.value;
      const city = (document.getElementById('City') as HTMLInputElement)?.value;
      const tokef = (document.getElementById('Tokef') as HTMLInputElement)?.value;

      document.getElementById('Result')!.innerHTML = '';
      document.getElementById('PayBtDiv')!.style.display = 'none';
      document.getElementById('OkDiv')!.style.display = 'none';
      document.getElementById('WaitPay')!.style.display = 'block';
      document.getElementById('ErrorDiv')!.innerHTML = '';

      PostNedarim({
        Name: 'FinishTransaction2',
        Value: {
          Mosad: mosad,
          ApiValid: apiValid,
          PaymentType: paymentType,
          Currency: '1',
          Zeout: '',
          FirstName: clientName,
          LastName: '',
          Street: street,
          City: city,
          Phone: '',
          Mail: '',
          Amount: amount,
          Tashlumim: '1',
          Groupe: '',
          Comment: 'בדיקת אייפרם 2',
          Param1: 'פרמטר 1',
          Param2: '',
          ForceUpdateMatching: '1',
          CallBack: '',
          CallBackMailError: '',
          Tokef: tokef,
        },
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
  }, []);

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
    </div>
  );
}
