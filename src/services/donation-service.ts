import { Donation, RefSummary } from "../@Types/chabadType";

const baseUrl = "https://node-beit-chabad-yaffo.onrender.com/api/payment"; // כתובת הבסיס של ה-API שלך

export const getAllDonations = async (): Promise<Donation[]> => {
  const response = await fetch(`${baseUrl}/nedarim/payments`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch donations');
  }
  
  const data = await response.json();
  return data as Donation[];
};

// services/donation-service.ts



export const getDonationsByRef = async (): Promise<RefSummary[]> => {
  const res = await fetch("/donations-by-ref");
  if (!res.ok) throw new Error("נכשל בטעינת סיכום לפי מתרים");
  return res.json();
};

