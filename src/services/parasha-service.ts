import axios, { AxiosRequestHeaders } from "axios";

// כתובת בסיס ל־API
const BASE_URL = "https://node-beit-chabad-yaffo-production.up.railway.app/api";

// מופע Axios עם baseURL והזרקת Authorization אוטומטית
const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        const headers: AxiosRequestHeaders = (config.headers ?? {}) as AxiosRequestHeaders;
        headers.Authorization = `Bearer ${token}`;
        config.headers = headers;
    }
    return config;
});

// ---- Parasha endpoints ----
const PARASHA_PATH = "/parasha";

// קבלת כל הפרשות
export const getAllParashot = async () => {
    try {
        const { data } = await api.get(PARASHA_PATH);
        if (!Array.isArray(data) || data.length === 0) {
            console.warn("No parashot found");
            return [];
        }
        return data;
    } catch (error) {
        console.error("Error fetching all parashot:", error);
        throw error;
    }
};

// קבלת הפרשה האחרונה (?last=true)
export const getLastParasha = async () => {
    try {
        const { data } = await api.get(PARASHA_PATH, { params: { last: "true" } });
        if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
            console.warn("No last parasha found");
            return null;
        }
        return data;
    } catch (error) {
        console.error("Error fetching last parasha:", error);
        throw error;
    }
};

// קבלת פרשה לפי מזהה
export const getParashaById = (id: string) => api.get(`${PARASHA_PATH}/${id}`);

// יצירת פרשה חדשה (FormData עם תמונה/קבצים)
export const createNewParasha = (form: FormData) => {
    // אל תגדירי Content-Type ידנית; Axios יקבע boundary לבד
    return api.post(PARASHA_PATH, form);
};

// עדכון פרשה קיימת
export const updateParasha = (id: string, form: FormData) => {
    // גם כאן לא צריך לציין Content-Type ידנית
    return api.put(`${PARASHA_PATH}/${id}`, form);
};

// מחיקת פרשה לפי מזהה
export const deleteParashaById = (id: string) => api.delete(`${PARASHA_PATH}/${id}`);
