import axios from "axios";
import { Donation, RefSummary } from "../@Types/chabadType";

const baseUrl = "https://node-beit-chabad-yaffo-production.up.railway.app/api/payment";

// ── יצירת Axios instance ──
const api = axios.create({
  baseURL: baseUrl,
});

// הזרקת Authorization אם יש טוקן
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    (config.headers ??= {} as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── פונקציות ──

// כל התרומות
export const getAllDonations = async (): Promise<Donation[]> => {
  const response = await api.get("/nedarim/payments");
  return response.data as Donation[];
};

// תרומות מסוכמות לפי ref
export const getAllDonationsByRef = async (): Promise<RefSummary[]> => {
  const response = await api.get("/donations-by-ref");
  return response.data as RefSummary[];
};
// תרומות לפי ref עם אפשרויות סינון
export const getDonationsByRef = async (ref: string): Promise<Donation[]> => {
  const { data } = await axios.get(`${baseUrl}/donations/${ref}`);
  return data;
};
