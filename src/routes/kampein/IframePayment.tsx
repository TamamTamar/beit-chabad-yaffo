// IframePayment.tsx
import { useEffect, useRef, useState } from "react";
import { sendPaymentData } from "../../services/paymentUtils";
import { iframeMessageListener } from "../../services/iframeListener";


const IframePayment = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(600);

  useEffect(() => {
    const removeListener = iframeMessageListener(setIframeHeight); // התחברות להאזנה להודעות מהאייפרם
    return removeListener;
  }, []);

  const handlePayment = () => {
    sendPaymentData(iframeRef); // קריאה לשליחת נתוני תשלום
  };

  return (
    <div style={{ width: "100%", height: `${iframeHeight}px` }}>
      <iframe ref={iframeRef} src="https://www.matara.pro/nedarimplus/iframe/" width="100%" height={iframeHeight} />
      <button onClick={handlePayment}>בצע תשלום</button>
    </div>
  );
};

export default IframePayment;
