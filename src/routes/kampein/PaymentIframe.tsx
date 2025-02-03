import React, { useEffect, useState } from 'react';

const PaymentIframe: React.FC = () => {
  const [iframeHeight, setIframeHeight] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('Message received:', event); // הוספנו את הודעת ה-Console כאן כדי לעקוב אחרי ההודעות
      if (event.origin === 'https://www.matara.pro') {
        if (event.data.height) {
          setIframeHeight(event.data.height);
        }
        if (event.data.success !== undefined) {
          setPaymentStatus(event.data.success ? 'העסקה הושלמה בהצלחה!' : 'הייתה בעיה בעסקה.');
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    if (iframeHeight > 0) {
      const iframe = document.getElementById('paymentIframe') as HTMLIFrameElement;
      iframe.style.height = `${iframeHeight}px`;
    }
  }, [iframeHeight]);

  return (
    <div>
      <iframe
        id="paymentIframe"
        src="https://www.matara.pro/nedarimplus/iframe/"
        width="100%"
        height="400px"
        frameBorder="0"
        style={{ height: `${iframeHeight}px` }}
      ></iframe>

      {/* כפתור לשליחת מידע לאייפרם */}
      <button onClick={() => alert('כאן תשלח את המידע לאייפרם')}>בצע תשלום</button>

      {/* הצגת סטטוס תשלום */}
      {paymentStatus && <div>{paymentStatus}</div>}
    </div>
  );
};

export default PaymentIframe;
