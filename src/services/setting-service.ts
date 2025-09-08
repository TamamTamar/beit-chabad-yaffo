// src/services/setting-service.ts
import api from "./api";

type GetRes = { value: string };
type PutRes = { key: string; value: string; updatedBy?: string; updatedAt?: string };

// תשובות ייעודיות
type RefGoalRes = { ref: string; goal: number | string };
type RefNameRes = { ref: string; name: string };
type RefMetaRes = { ref: string; goal: number; name: string };

export const settingsService = {

    getDonationsStart: async (): Promise<Date> => {
        const { data } = await api.get<GetRes>("/settings/donations-start");
        return new Date(data.value);
    },

    postSettings: async (date: Date | string) => {
        const iso = typeof date === "string" ? new Date(date).toISOString() : date.toISOString();
        const { data } = await api.put<PutRes>("/settings/donations-start", { value: iso });
        return {
            ...data,
            value: new Date(data.value),
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
        };
    },


    getRefGoal: async (ref: string): Promise<number> => {
        try {
            const { data } = await api.get<RefGoalRes>(`/settings/goal/${encodeURIComponent(ref)}`);
            const n = Number(data?.goal ?? 0);
            return Number.isFinite(n) ? n : 0;
        } catch (e: any) {
            if (e?.response?.status === 404) return 0; // אין יעד -> 0
            throw e;
        }
    },

    setRefGoal: async (ref: string, goal: number) => {
        const { data } = await api.put(`/settings/goal/${encodeURIComponent(ref)}`, { goal });
        return data;
    },

    getAllRefGoals: async (): Promise<Record<string, number>> => {
        // GET /api/settings/goals => יכול להחזיר { dl: 50000, ... } או [{ref,goal}]
        const { data } = await api.get("/settings/goals");
        const raw = data?.goals ?? data?.refGoals ?? data ?? {};
        const map = Array.isArray(raw)
            ? Object.fromEntries(
                raw
                    .filter((x: any) => x?.ref != null)
                    .map((x: any) => [String(x.ref).toLowerCase(), Number(x.goal) || 0])
            )
            : raw;

        const out: Record<string, number> = {};
        for (const [k, v] of Object.entries(map)) {
            out[String(k).toLowerCase()] = Number(v) || 0;
        }
        return out;
    },


    getRefName: async (ref: string): Promise<string> => {
        try {
            const { data } = await api.get<RefNameRes>(`/settings/name/${encodeURIComponent(ref)}`);
            return String(data?.name ?? "");
        } catch (e: any) {
            if (e?.response?.status === 404) return ""; // אין שם מוגדר -> ריק
            throw e;
        }
    },

    setRefName: async (ref: string, name: string) => {
        const { data } = await api.put(`/settings/name/${encodeURIComponent(ref)}`, { name });
        return data;
    },

    getAllRefNames: async (): Promise<Record<string, string>> => {
        // GET /api/settings/names => צפוי להחזיר { dl: "שם", ... }
        const { data } = await api.get("/settings/names");
        const raw = data?.names ?? data ?? {};
        const out: Record<string, string> = {};

        if (Array.isArray(raw)) {
            // תמיכה אם מחזירים מערך [{ref,name}]
            for (const x of raw) {
                const k = String(x?.ref ?? "").toLowerCase();
                if (k) out[k] = String(x?.name ?? "");
            }
        } else {
            for (const [k, v] of Object.entries(raw)) {
                out[String(k).toLowerCase()] = String(v ?? "");
            }
        }
        return out;
    },


    // אם הוספת בשרת GET /api/settings/ref/:ref
    getRefMeta: async (ref: string): Promise<{ goal: number; name: string }> => {
        try {
            const { data } = await api.get<RefMetaRes>(`/settings/ref/${encodeURIComponent(ref)}`);
            // הגנה אם השרת יחזיר goal כמחרוזת
            const goal = Number((data?.goal as any) ?? 0);
            return { goal: Number.isFinite(goal) ? goal : 0, name: String(data?.name ?? "") };
        } catch {
            // fallback: שתי קריאות נפרדות
            const [goal, name] = await Promise.all([settingsService.getRefGoal(ref), settingsService.getRefName(ref)]);
            return { goal, name };
        }
    },
};

export default settingsService;
