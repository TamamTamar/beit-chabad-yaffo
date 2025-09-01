import { jwtDecode } from "jwt-decode";
import { createContext, FC, useEffect, useMemo, useState } from "react";
import dialogs from "../ui/dialogs";
import { auth } from "../services/auth-service";
import { AuthContextType, ContextProviderProps, DecodedToken, IUser } from "../@Types/types";
import axios from "axios";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: FC<ContextProviderProps> = ({ children }) => {
    // ודאי שמתקבל מחרוזת ולא [object Object]
    const initialToken = (() => {
        const raw = localStorage.getItem("token");
        return raw && raw.startsWith("ey") ? raw : null;
    })();

    const [token, setToken] = useState<string | null>(initialToken);
    const [user, setUser] = useState<IUser | undefined>();
    const [loading, setLoading] = useState<boolean>(true);

    const isLoggedIn = useMemo(() => !!user, [user]);

    // להצמיד Authorization לכל הבקשות
    useEffect(() => {
        if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        else delete axios.defaults.headers.common.Authorization;
    }, [token]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                if (!token) {
                    setUser(undefined);
                    return;
                }
                // jwtDecode חייב לקבל רק את המחרוזת (ללא "Bearer ")
                const decoded = jwtDecode<DecodedToken>(token);
                const userRes = await auth.userDetails(decoded._id);
                setUser(userRes.data);
            } catch (e) {
                // אם יש טוקן לא תקין – ניקוי
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
            // 🔴 קודם היה: const token = res.data;
            const { token, user } = res.data; // ה־API שלך מחזיר { token, user }
            if (!token || typeof token !== "string") throw new Error("Bad login response");

            setToken(token);
            localStorage.setItem("token", token);
            setUser(user);

            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
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
        setToken(null);
        setUser(undefined);
        localStorage.removeItem("token");
        delete axios.defaults.headers.common.Authorization;
        dialogs.success("Logout Successful", "You have been logged out successfully.");
    };

    const onUpdateUser = (updatedUser: IUser) => setUser(updatedUser);

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, token, login, register, logout, onUpdateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
