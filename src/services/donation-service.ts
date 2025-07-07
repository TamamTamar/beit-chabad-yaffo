import axios from "axios";
import { Donation, RefSummary } from "../@Types/chabadType";

const baseUrl = "https://node-beit-chabad-yaffo.onrender.com/api/payment"; // כתובת הבסיס של ה-API שלך

export const getAllDonations = async (): Promise<Donation[]> => {
  const response = await axios.get(`${baseUrl}/nedarim/payments`);
  return response.data as Donation[];
};

export const getDonationsByRef = async (): Promise<RefSummary[]> => {
  const response = await axios.get(`${baseUrl}/donations-by-ref`);
  return response.data as RefSummary[];
};