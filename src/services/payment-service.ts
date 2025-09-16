// src/services/payment-service.ts
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

// ───────────────────────────────────────────────────────────────────────────────
// ── שערי מט"ח (USD→ILS) עם קאש ──

type RateCache = { value: number; fetchedAt: number };
let usdIlsCache: RateCache | null = null;
const RATE_TTL_MIN = 30; // תוקף קאש בדקות

export const getUsdToIlsRate = async (): Promise<number> => {
  const now = Date.now();
  if (usdIlsCache && now - usdIlsCache.fetchedAt < RATE_TTL_MIN * 60_000) {
  
    return usdIlsCache.value;
  }

  try {
    // Frankfurter: חינמי, ללא מפתח
    const { data } = await axios.get("https://api.frankfurter.app/latest", {
      params: { from: "USD", to: "ILS" },
    });
    const rate = Number(data?.rates?.ILS);
    if (Number.isFinite(rate) && rate > 0) {
      usdIlsCache = { value: rate, fetchedAt: now };
   
      return rate;
    }
  } catch (err) {
    console.warn("[getUsdToIlsRate] using fallback:", (err as any)?.message || err);
  }

  // fallback אם ה-API לא זמין
  const fallback = 3.7;
  usdIlsCache = { value: fallback, fetchedAt: now };

  return fallback;
};

// ───────────────────────────────────────────────────────────────────────────────
// ── API גולמי ──

export const getAllDonations = async (): Promise<Donation[]> => {
  const { data } = await api.get("/nedarim/payments");
  return data as Donation[];
};

export const getAllDonationsByRef = async (): Promise<RefSummary[]> => {
  const { data } = await api.get("/donations-by-ref");
  return data as RefSummary[];
};

export const getDonationsByRef = async (ref: string): Promise<Donation[]> => {
  const { data } = await api.get(`/donations/${ref}`);
  return data as Donation[];
};

// ───────────────────────────────────────────────────────────────────────────────
// ── עזרי תצוגה (לוגיקה משותפת) ──

export type CurrencyCode = 1 | 2; // 1=ILS, 2=USD

export type AggWithCurrency = AggregatedDonation & {
  currency?: number | null;
};

export type Totals = {
  amount: number;    // סה״כ נתרם (₪)
  count: number;     // מס' כרטיסים/תורמים
  goal: number;      // יעד (₪)
  remaining: number; // חסר ליעד (₪)
  percent: number;   // 0..100
};

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

// חישוב totals בשקלים (אפשר להעביר שער מותאם)
export const computeTotals = (
  donations: AggWithCurrency[],
  goal: number,
  usdToIlsRate = 3.7
): Totals => {
  const amountInIls = donations.reduce((sum, d) => {
    const value = d.combinedTotal || 0;
    return sum + (d.currency === 2 ? value * usdToIlsRate : value);
  }, 0);

  const remaining = Math.max(goal - amountInIls, 0);
  const percent = goal > 0 ? Math.min((amountInIls / goal) * 100, 100) : 0;

  return { amount: amountInIls, count: donations.length, goal, remaining, percent };
};

// גרסה אסינכרונית שמביאה שער עדכני אוטומטית + לוגים
export const computeTotalsILSAsync = async (
  donations: AggWithCurrency[],
  goal: number
): Promise<Totals> => {
  const rate = await getUsdToIlsRate(); // 1$ → ₪

  // לוג בדיקה: כמה מסכום התרומות בדולר וכמה בשקלים לפני ההמרה
  const usdSum = donations.reduce((s, d) => s + (d.currency === 2 ? (d.combinedTotal || 0) : 0), 0);
  const ilsSum = donations.reduce((s, d) => s + (d.currency !== 2 ? (d.combinedTotal || 0) : 0), 0);


  return computeTotals(donations, goal, rate);
};

// ───────────────────────────────────────────────────────────────────────────────
// ── פונקציות View לשימוש בקומפוננטות ──

export const getAllDonationsView = async () => {
  const [dateRaw, raw] = await Promise.all([
    settingsService.getDonationsStart(), // תאריך התחלה מה־DB
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

  // totals בשקלים, כולל המרת תרומות דולר לפי שער עדכני (עם לוגים)
  const totals = await computeTotalsILSAsync(donations, goal);

  return { donations, refName, totals };
};
