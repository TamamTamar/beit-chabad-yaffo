// paymentUtils.ts
export const sendPaymentData = (iframeRef: React.RefObject<HTMLIFrameElement>) => {
    const paymentData = {
      Mosad: "xxxxxxx", // מזהה מוסד בנדרים פלוס (7 ספרות)
      ApiValid: "xxxxxxx", // טקסט אימות
      Zeout: "123456789", // מספר תעודת זהות
      FirstName: "שם פרטי", // שם פרטי
      LastName: "שם משפחה", // שם משפחה
      Street: "רחוב תל אביב", // רחוב
      City: "תל אביב", // עיר
      Phone: "0501234567", // טלפון
      Mail: "email@example.com", // מייל
      PaymentType: "Ragil", // סוג תשלום (Ragil / HK / CreateToken)
      Amount: 100, // סכום כל העסקה או סכום כל חודש (לפי סוג תשלום)
      Tashlumim: 1, // מספר תשלומים או חודשים (לפי סוג תשלום)
      Currency: 1, // מטבע (1 לשקל / 2 לדולר)
      Groupe: "קטגוריה כלשהי", // קטגוריה
      Comment: "הערות לגבי העסקה", // הערות
      Param1: "טקסט חופשי לקאלבק", // טקסט חופשי מיועד לקאלבק
      Param2: "טקסט חופשי נוסף", // טקסט חופשי נוסף לקאלבק
      CallBack: "https://your-server/callback", // כתובת לקבלת עדכון לשרת
      CallBackMailError: "email@example.com" // כתובת מייל במקרה של שגיאה בקאלבק
    };
  
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(paymentData, "https://www.matara.pro");
    }
  };
  