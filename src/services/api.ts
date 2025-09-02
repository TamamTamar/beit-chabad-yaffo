// src/services/api.ts
import axios from "axios";
const api = axios.create({ baseURL: "https://node-beit-chabad-yaffo-production.up.railway.app/api" });
api.interceptors.request.use((config) => {
    const t = localStorage.getItem("token");
    if (t) (config.headers ??= {} as any).Authorization = `Bearer ${t}`;
    return config;
});
export default api;
