import axios from "axios";
import { ILogin, IUser, updateUserType } from "../@Types/types";

export const baseUrl = "https://node-beit-chabad-yaffo-production.up.railway.app/api";
export const usersUrl = `${baseUrl}/users`;
export const loginUrl = `${usersUrl}/login`;

// ── Axios instance עם baseURL והזרקת Authorization אוטומטית ──
const api = axios.create({
    baseURL: baseUrl,
});

// כל בקשה תצרף Bearer token אם קיים בלוקל סטורג'
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        (config.headers ??= {} as any).Authorization = `Bearer ${token}`;
    }
    return config;
});


// ── Endpoints ──
export const register = (data: IUser) => api.post("/users", data);
export const login = (data: ILogin) => api.post("/users/login", data);

export const userDetails = (id: string) => api.get(`/users/${id}`);
export const getAllUsers = () => api.get("/users");
export const getUserById = (id: string) => api.get(`/users/${id}`);
export const updateUser = (id: string, user: updateUserType) => api.put(`/users/${id}`, user);
export const deleteUserById = (id: string) => api.delete(`/users/${id}`);
export const businessUser = (id: string) => api.patch(`/users/${id}`, { isBusiness: true });

export const auth = {
    register,
    login,
    userDetails,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUserById,
    businessUser,
};

export default auth;
