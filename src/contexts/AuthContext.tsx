// AuthContext.tsx
import { jwtDecode } from "jwt-decode";
import { createContext, FC, useEffect, useMemo, useState } from "react";
import dialogs from "../ui/dialogs";
import { auth } from "../services/auth-service";
import { AuthContextType, ContextProviderProps, DecodedToken, IUser } from "../@Types/types";
import axios from "axios";

// ---- Helpers ----
const coerceToken = (raw: string | null): string | null => {
    if (!raw) return null;
    // אם נשמר "Bearer xxx" – נקלף
    if (raw.startsWith("Bearer ")) raw = raw.slice(7).trim();
    // אם נשמר כאובייקט JSON – ננסה לחלץ שדה token
    if (raw.startsWith("{")) {
        try {
            const parsed = JSON.parse(raw);
            if (typeof parsed?.token === "string") return parsed.token;
            return null;
        } catch {
            return null;
        }
    }
    // JWT בדרך כלל מכיל נקודות
    if (!raw.includes(".")) return null;
    return raw;
};

const setGlobalAuthHeader = (token: string | null) => {
    if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    else delete axios.defaults.headers.common.Authorization;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: FC<ContextProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(() => coerceToken(localStorage.getItem("token")));
    const [user, setUser] = useState<IUser | undefined>();
    const [loading, setLoading] = useState<boolean>(true);

    const isLoggedIn = useMemo(() => !!user, [user]);

    // הצמדה גלובלית של Authorization לכל הבקשות
    useEffect(() => {
        setGlobalAuthHeader(token);
    }, [token]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                if (!token) {
                    setUser(undefined);
                    return;
                }
                // מפענחים רק מה שצריך לפי DecodedToken: {_id, isAdmin}
                const decoded = jwtDecode<DecodedToken>(token);

                // אם צריך לבדוק פגות טוקן – תני לשרת להחזיר 401 ב-validateToken.
                // (הסרנו את בדיקת exp כי היא לא קיימת ב-DecodedToken שלך)

                const userRes = await auth.userDetails(decoded._id);
                setUser(userRes.data);
            } catch (e) {
                console.error("Auth bootstrap failed:", e);
                localStorage.removeItem("token");
                setToken(null);
                setUser(undefined);
            } finally {
                setLoading(false);
            }
        })();
    }, [token]);

    const login = async (email: string, password: string) => {
        try {
            const res = await auth.login({ email, password });
            const t: unknown = res.data?.token;
            const u: unknown = res.data?.user;
            if (typeof t !== "string") throw new Error("Bad login response: token missing");

            localStorage.setItem("token", t); // שומרות רק את המחרוזת!
            setToken(t);
            setUser(u as IUser);

            dialogs.success("Login", "Logged in");
        } catch (error) {
            console.error("Login error:", error);
            dialogs.error("Login Error", (error as any)?.response?.data?.message || "Unknown error");
            throw error;
        }
    };

    const register = async (form: IUser) => {
        await auth.register(form);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(undefined);
        setGlobalAuthHeader(null);
        dialogs.success("Logout Successful", "You have been logged out successfully.");
    };

    const onUpdateUser = (updatedUser: IUser) => setUser(updatedUser);

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, token, login, register, logout, onUpdateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
