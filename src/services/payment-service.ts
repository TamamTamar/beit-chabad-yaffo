// src/services/donation-service.ts
import axios from "axios";
import { Donation, RefSummary, AggregatedDonation } from "../@Types/chabadType";
import { settingsService } from "./setting-service";

const baseUrl = "https://node-beit-chabad-yaffo-production.up.railway.app/api/payment";

// ── יצירת Axios instance ──
const api = axios.create({ baseURL: baseUrl });

// הזרקת Authorization אם יש טוקן
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    (config.headers ??= {} as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── API גולמי ──
// כל התרומות
export const getAllDonations = async (): Promise<Donation[]> => {
  const { data } = await api.get("/nedarim/payments");
  return data as Donation[];
};

// סיכומי תרומות לפי ref (לשימוש אדמין/דשבורד)
export const getAllDonationsByRef = async (): Promise<RefSummary[]> => {
  const { data } = await api.get("/donations-by-ref");
  return data as RefSummary[];
};

// תרומות לפי ref
export const getDonationsByRef = async (ref: string): Promise<Donation[]> => {
  const { data } = await api.get(`/donations/${ref}`); // שימוש ב-instance כדי לקבל Authorization
  return data as Donation[];
};

// ───────────────────────────────────────────────────────────────────────────────
// ── עזרי תצוגה דקים (לוגיקה משותפת) ──

// 1=ILS, 2=USD
export type CurrencyCode = 1 | 2;

export type AggWithCurrency = AggregatedDonation & {
  currency?: number | null; // 1=ILS, 2=USD (ברירת מחדל ILS)
};

export type Totals = {
  amount: number;    // סכום מצטבר (₪)
  count: number;     // כמות תורמים
  goal: number;      // יעד (₪)
  remaining: number; // כמה חסר (₪)
  percent: number;   // 0..100
};

// פורמטרים
const ilsFmt = new Intl.NumberFormat("he-IL", {
  style: "currency",
  currency: "ILS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const usdFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatILS = (n: number) => ilsFmt.format(n || 0);
export const formatUSD = (n: number) => usdFmt.format(n || 0);
export const formatByCurrency = (amount: number, currency?: number | null) =>
  (Number(currency) as CurrencyCode) === 2 ? formatUSD(amount) : formatILS(amount);

// עוזרים למיפוי תרומה → אובייקט תצוגה
const displayName = (d: Donation) =>
  (d.PublicName && d.PublicName.trim()) ||
  [d.FirstName, d.LastName].filter(Boolean).join(" ") ||
  "—";

const toCurrency = (v: unknown): CurrencyCode => (Number(v) === 2 ? 2 : 1);

const mapDonationToAgg = (d: Donation): AggWithCurrency => {
  const monthly = Number(d.Amount ?? 0);
  const months = Number(d.Tashlumim ?? 1);
  const pastTotal = monthly * months;

  return {
    name: displayName(d),
    pastTotal,
    futureTotal: 0,
    combinedTotal: pastTotal,
    lizchut: (d.lizchut || "").toString().trim(),
    comment: (d.Comments || "").toString().trim(),
    currency: toCurrency(d.currency),
  };
};

export const computeTotals = (donations: AggWithCurrency[], goal: number): Totals => {
  const amount = donations.reduce((sum, d) => sum + (d.combinedTotal || 0), 0);
  const remaining = Math.max(goal - amount, 0);
  const percent = goal > 0 ? Math.min((amount / goal) * 100, 100) : 0;
  return { amount, count: donations.length, goal, remaining, percent };
};

// ── פונקציות View דקות לשימוש בקומפוננטות ──

// כל התרומות מאז תאריך התחלה (כמו בדף הכללי)
export const getAllDonationsView = async () => {
  const [dateRaw, raw] = await Promise.all([
    settingsService.getDonationsStart(), // תאריך התחלה מהשרת
    getAllDonations(),
  ]);

  const dateStr =
    dateRaw instanceof Date
      ? dateRaw.toISOString().slice(0, 10)
      : String(dateRaw || "").slice(0, 10);

  const fromTs = dateStr ? new Date(`${dateStr}T00:00:00Z`).getTime() : 0;

  const filtered = (raw || []).filter((d: Donation) => {
    const ts = d?.createdAt ? new Date(d.createdAt).getTime() : 0;
    return Number.isFinite(ts) && ts >= fromTs;
  });

  const donations = filtered.map(mapDonationToAgg);
  const uniqueDonorsCount = new Set(donations.map((d) => d.name)).size;

  return { donations, uniqueDonorsCount, dateOfBeginning: dateStr };
};

// תרומות לפי ref + יעד/שם + totals (כמו בדף byRef)
export const getDonationsByRefView = async (ref: string) => {
  const [donRes, goalRes, nameRes] = await Promise.allSettled([
    getDonationsByRef(ref),
    settingsService.getRefGoal(ref),
    settingsService.getRefName(ref),
  ]);

  const raw: Donation[] =
    donRes.status === "fulfilled" && Array.isArray(donRes.value) ? donRes.value : [];
  const goal: number = goalRes.status === "fulfilled" ? Number(goalRes.value) || 0 : 0;
  const refName: string = nameRes.status === "fulfilled" ? String(nameRes.value || "") : "";

  const donations = raw.map(mapDonationToAgg);
  const totals = computeTotals(donations, goal);

  return { donations, refName, totals };
};
