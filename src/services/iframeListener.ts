// iframeListener.ts
export const iframeMessageListener = (setIframeHeight: React.Dispatch<React.SetStateAction<number>>) => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin === "https://www.matara.pro") {
        if (event.data.type === "height") {
          setIframeHeight(event.data.height); // עדכון גובה האייפרם
        }
        if (event.data.type === "paymentResult") {
          const result = event.data.result;
          console.log("תוצאת העסקה:", result); // הצגת תוצאת העסקה
          // תוכל גם לעדכן את הממשק כאן אם נדרש
        }
      }
    };
  
    window.addEventListener("message", onMessage); // התחברות להאזנה להודעות
  
    return () => {
      window.removeEventListener("message", onMessage); // ניתוק מהאזנה
    };
  };
  