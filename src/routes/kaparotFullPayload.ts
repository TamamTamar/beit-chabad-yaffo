// src/payments/kaparotFullPayload.ts
// יוצר Payload מלא לכפרות עם כל השדות הנתמכים ע"י נדרים פלוס
// החובה: Mosad, ApiValid, PaymentType=Ragil, Amount, Tashlumim
// כל השדות האחרים ריקים כברירת מחדל

export type PaymentType = "Ragil" | "HK" | "CreateToken";

export interface KaparotFullPayload {
    Mosad: string;             // מזהה מוסד (7 ספרות)
    ApiValid: string;          // טקסט אימות
    Zeout: string;             // ת"ז
    FirstName: string;
    LastName: string;
    Street: string;
    City: string;
    Phone: string;
    Mail: string;
    PaymentType: PaymentType;  // Ragil / HK / CreateToken
    Amount: number;
    Tashlumim: number;
    Day: string;
    Currency: string;          // "1"=שקל | "2"=דולר
    Groupe: string;
    Comment: string;
    Param1: string;
    Param2: string;
    CallBack: string;
    CallBackMailError: string;
}

/**
 * יוצר Payload מלא עם כל השדות, כשהחובה מאוכלסים והשאר ריקים.
 */
export function createFullKaparotPayload(params: {
    Mosad: string;       // חובה
    ApiValid: string;    // חובה
    Amount: number;      // חובה
    Tashlumim?: number;  // ברירת מחדל 1
    Currency?: "1" | "2"; // חדש: 1=שקל, 2=דולר
}): KaparotFullPayload {
    return {
        Mosad: params.Mosad,
        ApiValid: params.ApiValid,
        PaymentType: "Ragil",
        Amount: params.Amount,
        Tashlumim: params.Tashlumim ?? 1,

        Zeout: "",
        FirstName: "",
        LastName: "",
        Street: "",
        City: "",
        Phone: "",
        Mail: "",
        Day: "",
        Currency: params.Currency ?? "1", // ← במקום שהיה קבוע ל-1
        Groupe: "",
        Comment: "כפרות",
        Param1: "",
        Param2: "",
        CallBack: "",
        CallBackMailError: "",
    };
}
