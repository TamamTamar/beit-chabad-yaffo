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
    phone: string;
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
    firstname: string;
    lastname: string;
    phone: string;
    mail: string;
    adults: number;
    children: number;
};
export type PaymentData = {
    Mosad: string; // מזהה המוסד
    ApiValid: string; // מפתח API
    Zeout: string; // מספר זהות
    FirstName: string; // שם פרטי
    LastName: string; // שם משפחה
    Street: string; // רחוב
    City: string; // עיר
    Phone: string; // מספר טלפון
    Mail: string; // כתובת דוא"ל
    PaymentType: "HK" | "Ragil"; // סוג תשלום (הוראת קבע או רגיל)
    Amount: number; // סכום התשלום
    Tashlumim: number; // מספר תשלומים
    Currency: number; // מטבע (1 = שקלים)
    Groupe: string; // קבוצה
    Comment: string; // הערה
    CallBack: string; // כתובת קריאה חוזרת
    CallBackMailError: string; // כתובת דוא"ל לשגיאות

    
};
type PaymentFormProps = {
  monthlyAmount?: number;
};

export type BannerItem = {
    title: string;
    subtitle: string;
    buttonText: string;
    navigateTo: string;
    className: string;
    image: string;
};
export type DonationItem = {
    DT_RowId: string;
    [key: string]: string;
};

export type AggregatedDonation = {
    name: string;
    pastTotal: number;
    futureTotal: number;
    combinedTotal: number;
    lizchut: string;
    
};

// @Types/chabadType.ts
export type Donation = {
    FirstName?: string;
    LastName?: string;
    Amount?: number;
    Tashlumim?: number;
    lizchut?: string;
    Comments?: string;
    createdAt?: string;
    // חדש מהשרת (virtual)
    PublicName?: string;
    DisplayAsAnonymous?: boolean;
    currency?: string;
};

export type RefSummary = {
  ref: string;
  totalAmount: number;
  donationCount: number;
};
export type ByRefResponse = { items?: Donation[] } | Donation[];