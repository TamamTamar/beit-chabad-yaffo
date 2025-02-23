import { useEffect } from 'react';

// הרחבת הממשק הגלובלי כדי ש-TypeScript יכיר את PayBtClick
declare global {
  interface Window {
    PayBtClick?: () => void;
  }
}

const NedarimDonation = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/nedarim.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // ניקוי כשעוזבים את הקומפוננטה
    };
  }, []);

  return (
    <div>
      <iframe
        id="NedarimFrame"
        title="Nedarim Plus"
        style={{ width: '100%', border: 'none' }}
        src="https://matara.pro/nedarimplus/iframe?language=en"
      ></iframe>
      <div id="WaitNedarimFrame">טוען...</div>
      <div id="PayBtDiv">
        <button onClick={() => window.PayBtClick?.()}>בצע תשלום</button>
      </div>
      <div id="Result"></div>
      <div id="ErrorDiv"></div>
      <div id="OkDiv" style={{ display: 'none' }}>תשלום הושלם בהצלחה!</div>
    </div>
  );
};

export default NedarimDonation;
