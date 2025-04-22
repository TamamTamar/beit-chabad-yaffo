import { IParashaInput } from "./productType";

type CandleLightingItem = {
    title: string;
    date: string;
    category: string;
    hebrew: string;
    memo?: string;
};

type HebcalData = {
    items: CandleLightingItem[];
};

export type ShabbatData = {
    date: string;
    parasha: string;
    candles: string;
    havdalah: string;
};


export type ParashaInput = {
    source: string;          // שם המחבר
    title: string;           // כותרת הפרשה
    miniText: string;        // טקסט מקוצר שמתאר את הפרשה
    alt: string;             // תיאור התמונה (alt)
    image: IImage;    // תמונה של הפרשה
    longText: longText[]; // רשימת עמודי הפרשה
};

export type longText = {
    title?: string; // כותרת של עמוד
    text: string;  // תוכן של עמוד
};

export type Parasha = ParashaInput & {
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
};
interface PaymentFormProps {
    institutionId: string;
    apiValid: string;
    zeout: string;
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    phone: string;
    email: string;
    paymentType: string;
    amount: number;  // הוספת סכום כאן
    tashlumim: number;
    currency: number;
    groupe: string;
    comment: string;
    param1: string;
    param2: string;
    callBack: string;
    callBackMailError: string;
}
interface shabbat {
    date: string;
    rawDate: string;
    parasha: string;
    category: string;
}
export interface RishumShabbatType {
    _id: string;
    parasha: string;
    date: string;
    totalPrice: number;
    createdAt: Date;
    name: string;
    people: {
        adults: {
            quantity: number;
            price: number;
        };
        children: {
            quantity: number;
            price: number;
        };
    };
  }
  interface RishumShabbatInput {
      name: string;
      adults: number;
      children: number;
  }