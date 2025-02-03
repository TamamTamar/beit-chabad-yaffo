// apiUtils.ts
export const sendCallbackToServer = async (result: any) => {
    try {
      const response = await fetch("/callback-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      const data = await response.json();
      console.log("תשובת השרת:", data); // הצגת תשובת השרת
    } catch (error) {
      console.error("שגיאה בשליחה לשרת:", error); // טיפול בשגיאה
    }
  };
  