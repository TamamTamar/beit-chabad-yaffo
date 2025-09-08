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
 //get all donations
export const getAllDonations = async (): Promise<Donation[]> => {
  const response = await api.get("/nedarim/payments");
  return response.data as Donation[];
};
// get all donations by ref
 export const getAllDonationsByRef = async (): Promise<RefSummary[]> => {
  const response = await api.get("/");
  return response.data as RefSummary[];
};
export const getDonationsByRef = async (ref: string): Promise<Donation[]> => {
  const { data } = await axios.get(`${baseUrl}/donations/${ref}`);
  return data;
};
 