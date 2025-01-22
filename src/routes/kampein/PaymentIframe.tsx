import React, { useEffect, useRef, useState } from 'react';

interface PaymentProps {
  mosad: string;
  apiValid: string;
  zeout: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  phone: string;
  email: string;
  paymentType: string;
  amount: number;
  currency: number;
  comment: string;
  callbackUrl: string;
}

const PaymentIframe: React.FC<PaymentProps> = ({
  mosad,
  apiValid,
  zeout,
  firstName,
  lastName,
  street,
  city,
  phone,
  email,
  paymentType,
  amount,
  currency,
  comment,
  callbackUrl,
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  // שליחה לאייפרם ברגע שהרכיב נטען
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      const message = {
        Mosad: mosad,
        ApiValid: apiValid,
        Zeout: zeout,
        FirstName: firstName,
        LastName: lastName,
        Street: street,
        City: city,
        Phone: phone,
        Mail: email,
        PaymentType: paymentType,
        Amount: amount,
        Currency: currency,
        Groupe: 'תרומות', // ניתן לשנות לפי הצורך
        Comment: comment,
        CallBack: callbackUrl,
      };

      iframe.contentWindow?.postMessage(message, 'https://www.matara.pro');
    }
  }, [mosad, apiValid, zeout, firstName, lastName, street, city, phone, email, paymentType, amount, currency, comment, callbackUrl]);

  // קבלת התגובה מה-iFrame
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.matara.pro') return;

      const response = event.data;
      if (response.status === 'success') {
        setStatus('העסקה הצליחה!');
      } else {
        setStatus('העסקה נכשלה!');
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div>
      <iframe
        ref={iframeRef}
        src="https://www.matara.pro/nedarimplus/iframe/"
        style={{ width: '60%', border: 'none', height: '500px' }}
        scrolling="no"
        title="Payment iFrame"
      />
      <div>{status && <p>{status}</p>}</div>
    </div>
  );
};

export default PaymentIframe;
